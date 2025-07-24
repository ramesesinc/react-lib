import useService from "../mgmt-api/useService";
import { getError } from "../axios/axios-utils";

export class ServiceExecutor {

    async GET( req: any, { params, callback }: { params: any, callback?: Function }) {
        try {
            const searchParams = req.nextUrl.searchParams;
            const query: Record<string, any> = {};
            for (const [key, value] of searchParams.entries()) {
                query[key] = value;
            }

            const { tenant, module, serviceid, action } = params;
            const svc = useService({ tenant, module }); 
            const result = await svc.resolve( serviceid, action ); 

            const { status, msg: message } = result ?? {};
            if ( String(status).toUpperCase() === "ERROR" ) {
                return { status: 500, message, error: message };
            }

            if ( callback ) {
                const result_2 = callback( result ); 
                if ( result_2 instanceof Promise ) {
                    return await result_2;
                }
                return result_2;
            }
            return result;
        }
        catch (err: any) {
            console.error( err ); 
            const result: Record<string, any> = getError(err);
            result.error = result.message; 
            return result; 
        }
    }

    async POST( req: any, { params, callback, body }: { params: any, callback?: Function, body?: any }) {
        try {
            let postBody = body; 
            if ( postBody === null || postBody === undefined ) {
                postBody = await req.json(); 
            }

            const { tenant, module, serviceid, action } = params;
            const svc = useService({ tenant, module }); 
            const result = await svc.invoke( serviceid, action, postBody ); 
            
            const { status, msg: message } = result ?? {};
            if ( String(status).toUpperCase() === "ERROR" ) {
                return { status: 500, message, error: message };
            }

            if ( callback ) {
                const result_2 = callback( result ); 
                if ( result_2 instanceof Promise ) {
                    return await result_2;
                }
                return result_2;
            }
            return result;
        }
        catch (err: any) {
            console.error( err ); 
            const result: Record<string, any> = getError(err);
            result.error = result.message; 
            return result; 
        }
    }
}
