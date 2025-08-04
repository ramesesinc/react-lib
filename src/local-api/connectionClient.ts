import { AxiosInstance } from "axios";
import { getError } from "../axios/axios-utils";
import { Platform } from "../common/platform";
import localAPI from "./api";

type ConnectionInfo = Record<string, any>;

class ConnectionAPIClass {
  private tenant: string;
  private client: AxiosInstance;

  constructor(tenant: string) {
    this.tenant = tenant;
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

  async execute(type: string, connectionID: string, body: Record<string, any>) {
    const resolveResult = (resp: any) => {
      const { data } = resp ?? {};
      return data;
    };

    const path = `/connections/${this.tenant}/${connectionID}`;
    if (type === "GET") {
      return resolveResult(await this.client.get(path));
    }

    throw new Error(`'${type}' not yet supported`);
  }
}

const ConnectionClient = (tenant?: string) => {
  let preferredTenant = tenant ?? Platform.TENANT_NAME ?? "";

  if (preferredTenant === "") {
    throw new Error("tenant is required in local-api/connectionClient");
  }

  return new ConnectionAPIClass(preferredTenant);
};

export default ConnectionClient;
