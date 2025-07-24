import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

export type AxiosBuilderCallback = (config: InternalAxiosRequestConfig<any>) => void;

type AxiosBuildProps = {
    baseURL?: string;
    callback?: AxiosBuilderCallback;
}
type AxiosBuildClassProps = AxiosBuildProps & {
    callback: AxiosBuilderCallback;
}
class AxiosBuilderClass {

    build( props: AxiosBuildClassProps ) : AxiosInstance {
        const { baseURL, callback } = props;

        const createParams = {} as Record<string, any>;
        if (( baseURL ?? '' ) !== '' ) {
            createParams.baseURL = baseURL; 
        }
        
        // Create an Axios instance
        const api = axios.create( createParams );

        // Add an interceptor to inject the header 
        api.interceptors.request.use(config => {
            if ( callback ) { 
                callback( config ); 
            } 
            return config;
        });

        return api;
    }

}

const AxiosBuilder = {
    build: ( props?: AxiosBuildProps ) : AxiosInstance => {
        let { baseURL, callback } = (props ?? {}); 
        callback = ( callback ?? ((config: any) => {}));

        const newProps = { baseURL, callback }
        return new AxiosBuilderClass().build( newProps ); 
    } 
};

export default AxiosBuilder;
