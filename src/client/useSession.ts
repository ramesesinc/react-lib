import { fetchSessionId, verifySessionToken } from "../server/session";
import { useMongoAPI } from "./useMongoAPI";

interface GetSessionInfoProps {
    tenant?: string | null;
    module?: string | null;
    connectionid?: string | null;
}

class UseSessionImpl {

    async getToken() {
        try { 
            return await fetchSessionId(); 
        } catch(err) {
            return null; 
        }
    }

    async getTokenInfo() { 
        const token = await this.getToken(); 
        if (( token ?? '' ) === '') { 
            return null; 
        } 

        try {
            const verifiedToken = await verifySessionToken( token! ); 
            return verifiedToken; 
        } catch(err) {
            return null; 
        }
    }

    async getSessionId() {
        const token = await this.getTokenInfo(); 
        return ( token?.SESSIONID ?? null );
    }

    async getSessionInfo( props: GetSessionInfoProps = {} ) {
        const sessionid = await this.getSessionId(); 
        if ((sessionid ?? '') === '') {
            return null; 
        }

        let { tenant, module, connectionid } = props;
        if (( tenant ?? '' ) === '' ) {
            tenant = ((process.env.TENANT_NAME || process.env.NEXT_PUBLIC_TENANT_NAME) || "");
        } 
        tenant = tenant ?? '';
        module = module ?? 'main'; 
        connectionid = connectionid ?? 'mongo-server'; 

        const api = useMongoAPI({ tenant, module, connectionid }); 
        return await api.get(`/sessions/${sessionid}`); 
    }
}

export const useSession = () => {
    return new UseSessionImpl(); 
};

// export default useSession;