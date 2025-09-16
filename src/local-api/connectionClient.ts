import { AxiosInstance } from "axios";
import { getError } from "../axios/axios-utils";
import { Platform } from "../common/platform";
import localAPI from "./api";

type ConnectionInfo = Record<string, any>;

class ConnectionAPIClass {
  private tenant: string;
  private config: Record<string, any>;
  private client: AxiosInstance;

  constructor(tenant: string, config: Record<string, any> = {}) {
    this.tenant = tenant;
    this.config = config;
    this.client = localAPI.createAxiosClient();
  }

  async getConnection(connectionID: string): Promise<ConnectionInfo> {
    if (connectionID === "list") {
      throw new Error(`'${connectionID}' is not a valid connectionID`);
    }

    try {
      return await this.execute("GET", connectionID, {});
    } catch (err) {
      const e = getError(err);
      throw new Error(e.message);
    }
  }

  async getConnections(): Promise<ConnectionInfo[]> {
    try {
      return await this.execute("GET", "list", {});
    } catch (err) {
      const e = getError(err);
      throw new Error(e.message);
    }
  }

  fillTemplate(template: string): string {
    return template.replace(/\${(.*?)}/g, (_, key) => this.config[key] ?? `:${key}`);
  }

  async execute(type: string, connectionID: string, body: Record<string, any>) {
    const resolveResult = (resp: any) => {
      const { data } = resp ?? {};
      if (data != null && typeof data === "object") {
        const parsedData = Object.entries(data)
          .filter(([_, v]) => typeof v === "string")
          .reduce((acc, [k, v]) => {
            acc[k] = this.fillTemplate(v as string);
            return acc;
          }, {} as Record<string, string>);

        return { ...data, ...parsedData };
      }

      return data;
    };

    const requestData = {} as { path: string, type: string, data: unknown }
    requestData.path = `/connections/${this.tenant}/${connectionID}`;
    requestData.type = type.toUpperCase(); 

    if (requestData.type === "GET") {
      requestData.data = body;
      const resp = await this.client.post('/invoke', requestData); 
      return resolveResult(resp);
    }

    throw new Error(`'${type}' not yet supported`);
  }
}

const connectionClient = (tenant?: string, config?: Record<string, any>) => {
  let preferredTenant = tenant ?? Platform.TENANT_NAME ?? "";

  if (preferredTenant === "") {
    throw new Error("tenant is required in local-api/connectionClient");
  }

  return new ConnectionAPIClass(preferredTenant, config ?? {});
};

export default connectionClient;
