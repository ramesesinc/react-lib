import { AxiosInstance } from "axios";
import Platform from "../common/platform";
import localAPI from "./api";

class UseModuleClass {

    private tenant: string;
    private client: AxiosInstance; 

    constructor( tenant: string ) {
        this.tenant = tenant;
        this.client = localAPI.createAxiosClient(); 
    }

    async get( module: string ) {
        const path = `/modules/${this.tenant}/${module}`; 
        const resp = await this.client.get( path ); 
        const { data } = resp ?? {}; 
        return data; 
    } 
} 

const useModule = ( tenant?: string ) => {
    let preferredTenant = ( tenant ?? Platform.TENANT_NAME ) ?? '';

    if ( preferredTenant === '' ) {
        throw new Error("tenant is required in local-api/useModule"); 
    }

    return new UseModuleClass( preferredTenant ); 
};

export default useModule;
