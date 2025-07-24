import { AxiosInstance } from "axios";
import Platform from "../common/platform";
import localAPI from "./api";

type UseModuleDataProps = {
    data: Record<string, any>;
}
type UseModuleExecProps = {
    serviceid?: string;
    action: string;
}
type UseModuleResolveProps = UseModuleExecProps & {
    serviceid: string;
}
class UseModuleClass {

    private tenant: string;
    private module: string;
    private client: AxiosInstance; 

    constructor( tenant: string, module: string ) {
        this.tenant = tenant;
        this.module = module;
        this.client = localAPI.createAxiosClient(); 
    }

    async exec( props: UseModuleExecProps & UseModuleDataProps ) {
        const { serviceid, action, data } = props; 
        const paths = [ '/services/exec', this.tenant, this.module, serviceid, action ];
        const path = paths.filter((item) => (item ?? null !== null)).join("/");  

        const reqParams = { url: path, method: 'POST', data } 
        const resp = await this.client.request( reqParams ); 
        const { data: respData } = resp ?? {}; 
        return respData; 
    } 

    async resolve( props: UseModuleResolveProps ) {
        const { serviceid, action } = props; 
        const path = `/services/exec/${this.tenant}/${this.module}/${serviceid}/${action}`;
        const resp = await this.client.get( path ); 
        const { data: respData } = resp ?? {}; 
        return respData; 
    } 
} 

const useService = ( props: { tenant?: string, module: string }) => {
    let { tenant, module } = props; 

    tenant = ( tenant ?? Platform.TENANT_NAME ) ?? '';
    if ( tenant === '' ) {
        throw new Error("tenant is required in local-api/useService"); 
    }

    return new UseModuleClass( tenant, module ); 
};

export default useService;
