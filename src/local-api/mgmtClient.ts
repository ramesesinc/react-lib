import { AxiosInstance } from "axios";
import { Platform } from "../common/platform";
import { getError } from "../axios";
import localAPI from "./api";

type MgmtClientClassProps = {
    tenant: string;
    module?: string;
}
class MgmtClientClass {

    private client: AxiosInstance; 
    private props: MgmtClientClassProps = {} as MgmtClientClassProps; 

    constructor( props: MgmtClientClassProps ) {
        this.props = props;
        this.client = localAPI.createAxiosClient(); 
    }

    async get( collection: string, action: string ) {
        try {
            return await this.execute('GET', collection, action, {});
        } catch(err) {
            const e = getError( err ); 
            throw new Error( e.message ); 
        } 
    } 

    async post( collection: string, action: string, body: any ) {
        try {
            return await this.execute('POST', collection, action, body);
        } catch(err) {
            const e = getError( err ); 
            throw new Error( e.message ); 
        } 
    } 

    async execute( type: string, collection: string, action: string, body: any ) {
        const { tenant, module } = this.props; 
        const paths = [ '/mgmt', tenant, module, collection, action ]; 
        const path = paths.filter((item) => (item ?? null !== null)).join("/");

        const resolveResult = ( resp: any ) => {
            const { data } = resp ?? {};
            return data; 
        }

        const uType = type.toUpperCase(); 
        if ( uType === 'GET' ) {
            return resolveResult ( await this.client.get( path ));
        } else if ( uType === 'POST') {
            return resolveResult ( await this.client.post( path, body ));
        } 

        throw new Error(`'${type}' not yet supported`); 
    }
} 

const mgmtClient = ( props: { tenant?: string, module?: string } ) => {
    let { tenant, module } = props; 

    tenant = ( tenant ?? Platform.TENANT_NAME ) ?? '';
    if ( tenant === '' ) {
        throw new Error("tenant is required in local-api/mgmtClient"); 
    }

    const newProps = { tenant, module } as MgmtClientClassProps;  
    return new MgmtClientClass( newProps ); 
};

export default mgmtClient;
