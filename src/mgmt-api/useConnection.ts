import { AxiosInstance } from "axios";
import { Platform } from "../common/platform";
import mgmtAPI from "./api";

interface UseConnectionProps {
    tenant: string;
    module?: string;
}
class UseConnectionImpl {

    private client: AxiosInstance;
    private props: UseConnectionProps = {} as UseConnectionProps;
    private config: Record<string, any>;

    constructor(props: UseConnectionProps, config: Record<string, any>) {
        this.props = props;
        this.config = config;
        this.client = mgmtAPI.createAxiosClient();
    }

    async get(connectionid: string) {
        const { tenant, module } = this.props;
        const paths = ['/connections', tenant, module, connectionid];
        const path = paths.filter((item) => (item ?? null !== null)).join("/");
        const resp = await this.client.get(path);
        const { data } = resp ?? {};

        if (data != null && typeof data === 'object') {
            const parsedData = Object.entries(data)
                .filter(([_, v]) => typeof v === "string")
                .reduce((acc, [k, v]) => {
                    acc[k] = this.fillTemplate(v as string);
                    return acc;
                }, {} as Record<string, string>);

            return { ...data, parsedData }
        }

        return data;
    }

    fillTemplate(template: string): string {
        return template.replace(/\${(.*?)}/g, (_, key) => this.config[key] ?? `:${key}`);
    }
}

const useConnection = (props: { tenant?: string, module?: string, [key: string]: any } = {}) => {

    let { tenant, module, ...rest } = props;

    tenant = (tenant ?? Platform.TENANT_NAME) ?? '';
    if (tenant === '') {
        throw new Error("tenant is required in mgmt-api/useConnection");
    }

    const newProps = { tenant, module } as UseConnectionProps;
    return new UseConnectionImpl(newProps, rest);
};

export default useConnection;
