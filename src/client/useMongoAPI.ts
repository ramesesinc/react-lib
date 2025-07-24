import AxiosBuilder from "../axios/axios-builder";
import useConnection from "../mgmt-api/useConnection";

interface MongoApiProps {
    connectionid: string;
    tenant: string;
    module?: string;
    basePath?: string;
    [key: string]: any;
}

class MongoApiClass {

    private props: MongoApiProps = {} as MongoApiProps;

    constructor( props: MongoApiProps ) {
        this.props = { ...props };
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

        const paths = [data.host, process.env.PLATFORM_NAME, tenant, module];
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
        const finalPath = [ basePath, reqPath ].join("/");
        const client = AxiosBuilder.build();
        const resp = await client.get( finalPath );
        const { data } = resp ?? {};
        return data;
    }

    async post( path: string, record: Record<string, any>) {
        let reqPath = path;
        if ( reqPath.startsWith('/')) {
            reqPath = reqPath.substring(1); 
        }
        const basePath = await this.getBasePath(); 
        const finalPath = [ basePath, reqPath ].join("/");
        const client = AxiosBuilder.build();
        const resp = await client.post( finalPath, record );
        const { data } = resp ?? {};
        return data;
    }
}

interface UseMongoApiProps {
    tenant?: string;
    module?: string;
    connectionid?: string;
}

const useMongoAPI = ( props: UseMongoApiProps = {} ) => {
    let { tenant, module, connectionid } = (props ?? {}); 

    if (( tenant ?? '' ) === '' ) {
        tenant = ((process.env.TENANT_NAME || process.env.NEXT_PUBLIC_TENANT_NAME) || "");
    } 
    connectionid = ( connectionid ?? 'mongo-server' ); 
    const params = { connectionid, tenant, module };
    return new MongoApiClass( params as MongoApiProps ); 
}; 

export default useMongoAPI;
