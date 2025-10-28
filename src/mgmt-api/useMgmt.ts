import { AxiosInstance } from "axios";
import { Platform } from "../common/platform";
import mgmtAPI from "./api";

interface UseMgmtClassProps {
  tenant: string;
  module?: string;
}

class UseMgmtClass {
  private client: AxiosInstance;
  private props: UseMgmtClassProps = {} as UseMgmtClassProps;

  constructor(props: UseMgmtClassProps) {
    this.props = props;
    this.client = mgmtAPI.createAxiosClient();
  }

  async get(collection: string, action: string) {
    const path = this.buildPath(collection, action);
    const resp = await this.client.get(path);
    const { data } = resp ?? {};
    return data;
  }

  async post(collection: string, action: string, body: Record<string, any>) {
    const path = this.buildPath(collection, action);
    const resp = await this.client.post(path, body);
    const { data } = resp ?? {};
    return data;
  }

  buildPath(collection: string, action: string) {
    const { tenant, module } = this.props;
    const paths = ["/mgmt", tenant, module, collection, encodeURIComponent(action)];
    return paths.filter((item) => item ?? null !== null).join("/");
  }
}

const useMgmt = (props: { tenant?: string; module?: string }) => {
  let { tenant, module } = props;

  tenant = tenant ?? Platform.TENANT_NAME ?? "";
  if (tenant === "") {
    throw new Error("tenant is required in mgmt-api/useMgmt");
  }

  const newProps = { tenant, module } as UseMgmtClassProps;
  return new UseMgmtClass(newProps);
};

export default useMgmt;
