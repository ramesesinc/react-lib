import { AxiosBuilder } from "../axios";
import { Platform } from "../common/platform";
import * as server from "./platform";

const assertRequired = (name: string, value: unknown, category: string) => {
   if ((value ?? '') === '') {
      throw new Error(`${name} is required in server-actions#${category}`);
   }
}

export async function getMongoData(path: string, config?: { connectionid?: string, tenant?: string, module?: string }) {
   assertRequired('path', path, 'getMongoData');
   return await requestMongoAction('GET', path, null, config);
}

export async function postMongoData(path: string, body: unknown, config?: { connectionid?: string, tenant?: string, module?: string }) {
   assertRequired('path', path, 'postMongoData');
   assertRequired('body', body, 'postMongoData');
   return await requestMongoAction('POST', path, body, config);
}

async function requestMongoAction(type: string, path: string, body: unknown, config?: { connectionid?: string, tenant?: string, module?: string }) {
   let { connectionid, tenant, module } = config ?? {};

   assertRequired('path', path, 'requestMongoAction');

   tenant = (tenant ?? Platform.TENANT_NAME) ?? '';
   assertRequired('tenant', tenant, 'requestMongoAction');

   const preferredConnectionId = connectionid ?? 'mongo-server';
   const data = await server.getConnection(preferredConnectionId, { tenant, module });
   if (data == null) {
      throw new Error(`${preferredConnectionId} connection not found`);
   }

   let { host } = data;
   assertRequired(`${preferredConnectionId}.host`, host, 'requestMongoAction');

   if (host.endsWith("/")) {
      host = host.slice(0, -1);
   }

   let newPath = path;
   if (newPath.startsWith("/")) {
      newPath = newPath.slice(1); 
   }

   const paths = [ host, Platform.PLATFORM_NAME, tenant, module, newPath];
   const reqPath = paths.filter((item) => (item ?? null !== null)).join("/");
   const client = AxiosBuilder.build();

   const resolveResult = ( resp: any ) => {
      const { data } = resp ?? {};
      return data; 
   }

   if ( type === 'GET ') {
      const resp = await client.get( reqPath );
      return resolveResult( resp );
   } 
   else {
      const resp = await client.post( reqPath, body ?? {});
      return resolveResult( resp );
   }
}
