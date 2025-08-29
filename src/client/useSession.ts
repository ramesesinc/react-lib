import { fetchSessionId, verifySessionToken } from "../server-actions";
import { useMongoAPI } from "./useMongoAPI";

interface GetSessionInfoProps {
    tenant?: string | null;
    module?: string | null;
    connectionid?: string | null;
    sessionid?: string | null;
}

class UseSessionImpl {

    async getToken() {
        try { 
            return await fetchSessionId(); 
        } catch(err) {
            return null; 
        }
    }

    async getTokenInfo( sessionID?: string ) { 
        const token = ( sessionID == null ? await this.getToken() : sessionID );
        if (( token ?? '' ) === '') { 
            return null; 
        } 

        try {
            const verifiedToken = await verifySessionToken( token! ); 
            return verifiedToken; 
        } catch(err) {
            console.log(err);
            return null; 
        }
    }

    async getSessionId() {
        const token = await this.getTokenInfo(); 
        return ( token?.SESSIONID ?? null );
    }

    async getSessionInfo( props: GetSessionInfoProps = {} ) {
        const { sessionid } = props; 

        let preferredSessionID: string | null = null; 
        if ( sessionid == null ) {
            preferredSessionID = await this.getSessionId(); 
        }

        if ((preferredSessionID ?? '') === '') {
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