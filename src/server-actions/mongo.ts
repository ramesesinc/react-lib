import { Platform } from "../common/platform";
import * as server from "./platform";

const assertRequired = (name: string, value: unknown, category: string) => {
   if ((value ?? '') === '') {
      throw new Error(`${name} is required in server-actions#${category}`);
   }
}

export async function getMongoData( path: string, config?: { connectionid?: string, tenant?: string, module?: string }) { 
   assertRequired('path', path, 'getMongoData'); 
   return await requestMongoAction( 'GET', path, null, config ); 
}

export async function postMongoData( path: string, body: unknown, config?: { connectionid?: string, tenant?: string, module?: string }) { 
   assertRequired('path', path, 'postMongoData'); 
   assertRequired('body', body, 'postMongoData'); 
   return await requestMongoAction( 'POST', path, body, config ); 
}

async function requestMongoAction( type: string, path: string, body: unknown, config?: { connectionid?: string, tenant?: string, module?: string }) {
   let { connectionid, tenant, module } = config ?? {};
   
   assertRequired('path', path, 'requestMongoAction'); 

   tenant = (tenant ?? Platform.TENANT_NAME) ?? '';
   assertRequired('tenant', tenant, 'requestMongoAction'); 

   const data = await server.getConnection( connectionid ?? 'mongo-server', { tenant, module }); 
   return data; 
}
