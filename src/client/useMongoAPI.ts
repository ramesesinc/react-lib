import { AxiosInstance } from "axios";
import AxiosBuilder from "../axios/axios-builder";
import { Platform } from "../common/platform";
import useConnection from "../mgmt-api/useConnection";

interface MongoApiProps {
    connectionid: string;
    tenant: string;
    module?: string;
    basePath?: string;
    [key: string]: any;
}

class MongoApiClass {

    private client: AxiosInstance;
    private props: MongoApiProps = {} as MongoApiProps;

    constructor( props: MongoApiProps ) {
        this.props = { ...props };
        this.client = AxiosBuilder.build({
            callback: (config) => {
                // console.log("MongoApiClass config.url => ", config.url); 
            }
        }); 
    }

    async getBasePath() {
        let { connectionid, tenant, module, basePath } = this.props;

        if ((basePath ?? '') !== '') {
            return basePath; 
        }

        const data = await useConnection({ tenant, module }).get( connectionid ); 
        const { host } = data ?? {};
        if (( host ?? '') === '') {
            throw Error(`${connectionid} connection requires a host setting`);
        }
        if (host.endsWith("/")) {
            data.host = host.substring(0, host.lastIndexOf("/"));
        }

        const paths = [data.host, Platform.PLATFORM_NAME, tenant, module];
        basePath = paths.filter((item) => (item ?? null !== null)).join("/");
        this.props.basePath = basePath;
        return this.props.basePath; 
    }

    async get( path: string ) {
        let reqPath = path;
        if ( reqPath.startsWith('/')) {
            reqPath = reqPath.substring(1); 
        }
        const basePath = await this.getBasePath(); 
        const finalPath = `${basePath}/${reqPath}`;
        const resp = await this.client.get( finalPath );
        const { data } = resp ?? {};
        return data;
    }

    async post( path: string, record: Record<string, any>) {
        let reqPath = path;
        if ( reqPath.startsWith('/')) {
            reqPath = reqPath.substring(1); 
        }
        const basePath = await this.getBasePath(); 
        const finalPath = `${basePath}/${reqPath}`; 
        const resp = await this.client.post( finalPath, record );
        const { data } = resp ?? {};
        return data;
    }
}

interface UseMongoApiProps {
    tenant?: string;
    module?: string;
    connectionid?: string;
}

export const useMongoAPI = ( props: UseMongoApiProps = {} ) => {
    let { tenant, module, connectionid } = (props ?? {}); 

    if (( tenant ?? '' ) === '' ) {
        tenant = (Platform.TENANT_NAME || "");
    } 
    connectionid = ( connectionid ?? 'mongo-server' ); 
    const params = { connectionid, tenant, module };
    return new MongoApiClass( params as MongoApiProps ); 
}; 

// export default useMongoAPI;
