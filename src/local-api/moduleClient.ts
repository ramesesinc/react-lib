import { AxiosInstance } from "axios";
import { Platform } from "../common/platform";
import { getError } from "../axios";
import localAPI from "./api";

type ModuleInfo = Record<string, any>;

class ModuleAPIClass {

    private tenant: string;
    private client: AxiosInstance; 

    constructor( tenant: string ) {
        this.tenant = tenant;
        this.client = localAPI.createAxiosClient(); 
    }

    async getModule( moduleID: string ) : Promise<ModuleInfo> {
        if ( moduleID === 'list' ) {
            throw new Error(`'${moduleID}' is not a valid moduleID`); 
        }

        try {
            return await this.execute('GET', moduleID, {});
        } catch(err) {
            const e = getError( err ); 
            throw new Error( e.message ); 
        } 
    } 

    async getModules() : Promise<ModuleInfo[]> { 
        try {
            return await this.execute('GET', 'list', {});
        } catch(err) {
            const e = getError( err ); 
            throw new Error( e.message ); 
        } 
    } 

    async execute( type: string, moduleID: string, body: Record<string, any> ) {

        const resolveResult = ( resp: any ) => {
            const { data } = resp ?? {};
            return data; 
        }

        const path = `/modules/${this.tenant}/${moduleID}`; 
        if ( type === 'GET' ) {
            return resolveResult( await this.client.get( path )); 
        } 

        throw new Error(`'${type}' not yet supported`); 
    }
} 

const moduleClient = ( tenant?: string ) => {
    let preferredTenant = ( tenant ?? Platform.TENANT_NAME ) ?? '';

    if ( preferredTenant === '' ) {
        throw new Error("tenant is required in local-api/moduleClient"); 
    }

    return new ModuleAPIClass( preferredTenant ); 
};

export default moduleClient;
