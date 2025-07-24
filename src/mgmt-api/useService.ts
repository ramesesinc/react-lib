import { AxiosInstance } from "axios";
import { useSession } from "../client/useSession";
import { Platform } from "../common/platform";
import mgmtAPI from "./api";

interface UserServiceImplProps {
    tenant: string, 
    module: string
}

class UseServiceImpl {

    private client: AxiosInstance; 
    private props: UserServiceImplProps = {} as UserServiceImplProps; 

    constructor( tenant: string, module: string ) {
        this.props = { tenant, module }; 
        this.client = mgmtAPI.createAxiosClient(); 
    }

    buildPath( serviceid: string, action: string, type: string ) : string {
        const { tenant, module } = this.props; 
        return `/services/${type}/${tenant}/${module}/${serviceid}/${action}`;
    }

    async resolve( serviceid: string, action: string ) {
        const path = this.buildPath( serviceid, action, 'resolve' ); 
        const resp = await this.client.get( path ); 
        const { data } = resp ?? {}; 
        return data; 
    } 

    async invoke( serviceid: string, action: string, body: Record<string, any> ) {
        const { tenant, module } = this.props; 
        
        const payload = this.createPayload( body ); 
        
        const sessParams = { tenant, module, connectionid: null }
        const sessInfo = await useSession().getSessionInfo( sessParams ); 
        
        payload.env = this.createEnv( sessInfo?.env ); 
        
        const path = this.buildPath( serviceid, action, 'invoke' ); 
        const resp = await this.client.post( path, payload ); 
        const { data } = resp ?? {}; 
        return data; 
    } 

    createEnv( env?: Record<string, any> ) {
        return { 
            ...(env ?? {}), 

            CLIENTTYPE: "web", 
            USER_AGENT: `react-web/${process.env.PLATFORM_NAME}` 
        }; 
    }

    createPayload( body: Record<string, any>) {
        return { 
            env: this.createEnv(), 
            args: body
        }; 
    } 
} 

const useService = ( props: { tenant?: string, module: string }) => {
    let { tenant, module } = props; 

    tenant = ( tenant ?? Platform.TENANT_NAME ) ?? '';
    if ( tenant === '' ) {
        throw new Error("tenant is required in mgmt-api/useService"); 
    }

    return new UseServiceImpl( tenant, module ); 
};

export default useService;
