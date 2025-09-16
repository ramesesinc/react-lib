import { AxiosInstance } from "axios";
import { Platform } from "../common/platform";
import { getError } from "../axios";
import localAPI from "./api";

type JobInstanceClientProps = {
    tenant: string;
    module?: string;
}
class JobInstanceClientClass {

    private client: AxiosInstance; 
    private props: JobInstanceClientProps = {} as JobInstanceClientProps; 

    constructor( props: JobInstanceClientProps ) {
        this.props = props;
        this.client = localAPI.createAxiosClient(); 
    }

    async get( action: string ) {
        try {
            return await this.execute('GET', action, {});
        } catch(err) {
            const e = getError( err ); 
            throw new Error( e.message ); 
        } 
    } 

    async post( action: string, body: any ) {
        try {
            return await this.execute('POST', action, body);
        } catch(err) {
            const e = getError( err ); 
            throw new Error( e.message ); 
        } 
    } 

    async execute( type: string, action: string, body: any ) {
        const contextPath = '/jobinstances';
        const requestData = {} as { path: string, type: string, data: unknown };

        if ( action === 'activelist' ) {
            requestData.path = `${contextPath}/${action}`;            
        }
        else {
            const { tenant, module } = this.props; 
            const paths = [ contextPath, tenant, module, action ]; 
            requestData.path = paths.join('/');
        }

        requestData.type = type.toUpperCase(); 
        requestData.data = body; 

        const resp = await this.client.post('/invoke', requestData);
        const { data } = resp ?? {};
        return data; 
    }

    async getActiveList( body: Record<string, any> = {} ) {
        try {
            const data = await this.execute('POST', 'activelist', body);
            return (data ?? []); 
        } 
        catch(err) {
            const e = getError( err ); 
            throw new Error( e.message ); 
        } 
    }
} 

const jobInstanceClient = ( props: { tenant?: string, module?: string } = {}) => {
    let { tenant, module } = props; 
    const newProps = { tenant, module } as JobInstanceClientProps;  
    return new JobInstanceClientClass( newProps ); 
};

export default jobInstanceClient;
