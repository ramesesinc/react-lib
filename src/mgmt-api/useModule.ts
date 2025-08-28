import { AxiosInstance } from "axios";
import { Platform } from "../common/platform";
import mgmtAPI from "./api";

class UseModuleClass {

    private tenant: string;
    private client: AxiosInstance; 

    constructor( tenant: string ) {
        this.tenant = tenant;
        this.client = mgmtAPI.createAxiosClient(); 
    }

    async get( module: string ) {
        const path = `/modules/${this.tenant}/${module}`;
        const resp = await this.client.get( path ); 
        const { data } = resp ?? {}; 
        return data; 
    } 

    async post( module: string, body: Record<string, any> ) {
        const path = `/modules/${this.tenant}/${module}`;
        const resp = await this.client.post( path, body );
        const { data } = resp ?? {};
        return data; 
    }

    async getModules( body: Record<string, any> = {} ) {
        return this.post("list", body ); 
    }
} 

const useModule = ( props: { tenant?: string } ) => {
    let { tenant } = props; 

    tenant = ( tenant ?? Platform.TENANT_NAME ) ?? '';
    if ( tenant === '' ) {
        throw new Error("tenant is required in mgmt-api/useModule"); 
    }

    return new UseModuleClass( tenant ); 
};

export default useModule;
