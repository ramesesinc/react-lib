import { Platform } from "../common/platform";
import * as mongo from "../server-actions/mongo";

interface MongoApiProps {
    connectionid: string;
    tenant: string;
    module?: string;
}

class MongoApiClass {

    private props: MongoApiProps = {} as MongoApiProps;

    constructor( props: MongoApiProps ) {
        this.props = { ...props };
    }

    async get( path: string ) {
        const data = await mongo.getMongoData( path, this.props ); 
        return data; 
    }

    async post( path: string, body: Record<string, any>) {
        const data = await mongo.postMongoData( path, body, this.props ); 
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
