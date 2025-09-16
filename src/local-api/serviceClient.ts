import { AxiosInstance } from "axios";
import { Platform } from "../common/platform";
import localAPI from "./api";
import { getError } from "../axios";

type ServiceClientDataProps = {
    data: Record<string, any>;
}
type ServiceClientExecProps = {
    serviceid?: string;
    action: string;
}
type ServiceClientResolveProps = ServiceClientExecProps & {
    serviceid: string;
}
class ServiceClientClass {

    private tenant: string;
    private module: string;
    private client: AxiosInstance; 

    constructor( tenant: string, module: string ) {
        this.tenant = tenant;
        this.module = module;
        this.client = localAPI.createAxiosClient(); 
    }
    
    async resolve( serviceid: string, action: string ) {
        try {
            const reqData = {} as { path: string, type: string, data: unknown }
            reqData.path = `/apis/resolve/${this.tenant}/${this.module}/${serviceid}/${action}`;
            reqData.type = 'GET';

            const resp = await this.client.post('/invoke', reqData); 
            const { data } = resp ?? {}; 
            return data; 
        }
        catch(err) {
            const e = getError( err ); 
            throw new Error( e.message ); 
        }
    } 

    async invoke( serviceid: string, action: string, body: Record<string, any> ) {
        try {
            const reqData = {} as { path: string, type: string, data: unknown }
            reqData.path = `/apis/invoke/${this.tenant}/${this.module}/${serviceid}/${action}`;
            reqData.type = 'POST';

            const resp = await this.client.post('/invoke', reqData); 
            const { data } = resp ?? {}; 
            return data; 
        }
        catch(err) {
            const e = getError( err ); 
            throw new Error( e.message ); 
        }
    } 

    async exec( props: { serviceid?: string, action: string, body: Record<string, any> }) {
        // 
        // this is use when serviceid is not set
        // for example: localapi/services/exec/base/admin/login
        //
        try {
            const { serviceid, action, body } = props; 
            const paths = [ '/services/exec', this.tenant, this.module, serviceid, action ];
            const path = paths.filter((item) => (item ?? null !== null)).join("/");         
    
            const reqParams = { url: path, method: 'POST', data: body } 
            const resp = await this.client.request( reqParams ); 
            const { data } = resp ?? {}; 
            return data; 
        }
        catch(err) {
            const e = getError( err ); 
            throw new Error( e.message ); 
        }
    } 
} 

const serviceClient = ( props: { tenant?: string, module: string }) => {
    let { tenant, module } = props; 

    tenant = ( tenant ?? Platform.TENANT_NAME ) ?? '';
    if ( tenant === '' ) {
        throw new Error("tenant is required in local-api/serviceClient"); 
    }

    return new ServiceClientClass( tenant, module ); 
};

export default serviceClient;
