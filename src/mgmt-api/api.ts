import { Platform } from "../common/platform";
import AxiosBuilder from "../axios/axios-builder";

const createAxiosClient = () => {
    const MGMT_SERVER_URI = Platform.MGMT_SERVER_URI; 
    if ( !MGMT_SERVER_URI ) { 
        throw new Error("'NEXT_PUBLIC_MGMT_SERVER_URI' env variable is not set"); 
    }

    return AxiosBuilder.build({ 
        baseURL: MGMT_SERVER_URI.trim(), 
        callback: (config) => {
            // console.log("mgmtAPI config.baseURL", config.baseURL );
            // console.log("mgmtAPI config.url", config.url );
        } 
    });
};

const mgmtAPI = {

    client: createAxiosClient(),

    createAxiosClient
}; 

export default mgmtAPI;
