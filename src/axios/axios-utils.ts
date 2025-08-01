import axios, { AxiosError } from "axios";

export const isAxiosError = ( err: unknown ): err is AxiosError => {
    if ( !err ) return false; 
    return axios.isAxiosError( err );  
};

export const getAxiosError = ( err: AxiosError ) => {

    const status = err.response?.status || 500;

    const errors = ( 'errors' in err ) ? err.errors : [];

    let message = null; 

    if ( err.response && err.response?.data ) {
        if (typeof err.response.data === "string") {
            message = err.response.data;
        } 
        else if (typeof err.response.data === "object" && err.response.data !== null ) {
            const data: any = err.response.data ?? {}; 
            message = data.message ?? data.msg;
        }
        else if ( err.response.data ) {
            message = String(err.response.data);
        }
    }
    else if ( err.message ) {
        message = err.message; 
    }
    else if ( errors && Array.isArray(errors) && errors.length > 0 ) {
        const lastErr = errors[ errors.length - 1 ]; 
        message = String(lastErr); 
    }
    else if ( err.code ) {
        message = String(err.code); 
    }

    return { status, message, cause: err, error: message }
}; 

export const getError = ( err: unknown ) : ErrorResult => {
    if ( isAxiosError(err)) { 
        return getAxiosError( err as AxiosError ); 
    }
    else if ( err instanceof Error ) {
        return { status: 500, message: err.message, cause: err, error: err.message };
    }
    return { status: 500, message: String(err), error: String(err) };
};

type ErrorResult = {
    status: number;
    message: string;
    error: string;
    cause?: any;
};