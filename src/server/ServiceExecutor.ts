import { NextRequest, NextResponse } from "next/server";
import useService from "../mgmt-api/useService";
import { getError } from "../axios/axios-utils";

export class ServiceExecutor {

    async postImpl( params: any, body: Record<string, any> ) {

        const { tenant, module, serviceid, action } = params;
        const svc = useService({ tenant, module }); 
        return await svc.invoke( serviceid, action, body ); 
    } 

    async GET( req: NextRequest, { params, callback }: { params: any, callback?: Function }) {
        try {
            const searchParams = req.nextUrl.searchParams;
            const query: Record<string, any> = {};
            for (const [key, value] of searchParams.entries()) {
                query[key] = value;
            }

            const result = await this.postImpl( params, query ); 

            const { status, msg: message } = result ?? {};
            if ( String(status).toUpperCase() === "ERROR" ) {
                return NextResponse.json({ message }, { status: 500 });
            }

            if ( callback ) {
                const result_2 = callback( result ); 
                if ( result_2 instanceof Promise ) {
                    const result_3 = await result_2;
                    return NextResponse.json( result_3 ?? {} );
                }
                return NextResponse.json( result_2 ?? {} );
            }
            return NextResponse.json(result ?? {});
        }
        catch (err: any) {
            const e: any = getError(err);
            const errStat = e.status;
            const errMsg = e.message;
            return NextResponse.json({ message: errMsg, cause: err }, { status: errStat });
        }
    }

    async POST( req: NextRequest, { params, callback, body }: { params: any, callback?: Function, body?: any }) {
        try {
            let postBody = body; 
            if ( postBody === null || postBody === undefined ) {
                postBody = await req.json(); 
            }

            const result = await this.postImpl( params, postBody ); 
            
            const { status, msg: message } = result ?? {};
            if ( String(status).toUpperCase() === "ERROR" ) {
                return NextResponse.json({ message }, { status: 500 });
            }

            if ( callback ) {
                const result_2 = callback( result ); 
                if ( result_2 instanceof Promise ) {
                    const result_3 = await result_2;
                    return NextResponse.json( result_3 ?? {} );
                }
                return NextResponse.json( result_2 ?? {} );
            }
            return NextResponse.json(result ?? {});
        }
        catch (err: any) {
            console.error( err ); 
            const e: any = getError(err);
            const errStat = e.status;
            const errMsg = e.message;
            return NextResponse.json({ message: errMsg, cause: err }, { status: errStat });
        }
    }
}
