import { AxiosInstance } from "axios";
import Platform from "../common/platform";
import mgmtAPI from "./api";

interface UseConnectionProps {
    tenant: string;
    module?: string;
}
class UseConnectionImpl {

    private client: AxiosInstance; 
    private props: UseConnectionProps = {} as UseConnectionProps; 

    constructor( props: UseConnectionProps ) {
        this.props = props;
        this.client = mgmtAPI.createAxiosClient(); 
    }

    async get( connectionid: string ) {
        const { tenant, module } = this.props; 
        const paths = [ '/connections', tenant, module, connectionid ];
        const path = paths.filter((item) => (item ?? null !== null)).join("/");
        const resp = await this.client.get( path ); 
        const { data } = resp ?? {}; 
        return data; 
    } 
} 

const useConnection = ( props: { tenant?: string, module?: string } = {}) => {

    let { tenant, module } = props; 

    tenant = ( tenant ?? Platform.TENANT_NAME ) ?? '';
    if ( tenant === '' ) {
        throw new Error("tenant is required in mgmt-api/useConnection"); 
    }

    const newProps = { tenant, module } as UseConnectionProps;
    return new UseConnectionImpl( newProps ); 
};

export default useConnection;
