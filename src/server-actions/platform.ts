'use server';

import { Platform } from "../index";
import { mgmtAPI } from "../mgmt-api";
import { getError } from "../axios/axios-utils";

// 
// connection actions
// 
export async function getConnection(connectionID: string, props?: { tenant?: string, module?: string }) {
    try {
        return await requestConnectionAction('GET', connectionID, props); 
    } 
    catch(err) {
        const e = getError( err ); 
        throw new Error( e.message ); 
    }
}
async function requestConnectionAction(type: string, connectionID: string, props?: { tenant?: string, module?: string }) {
    let { tenant, module } = props ?? {};

    const assertRequired = (name: string, value: any) => {
        if ((value ?? '') === '') {
            throw new Error(`${name} is required in actions/local#requestCollectionAction`); 
        }
    }

    tenant = (tenant ?? Platform.TENANT_NAME) ?? '';

    assertRequired('tenant', tenant); 
    assertRequired('connectionID', connectionID); 

    const client = mgmtAPI.createAxiosClient();
    const paths = ['/connections', tenant, module, connectionID];
    const path = paths.filter((item) => (item ?? null !== null)).join("/");
    const resp = await client.get(path);
    const { data } = resp ?? {};
    return data;
}


// 
// collection actions
// 
export async function getCollection(collection: string, action: string, props?: { tenant?: string, module?: string }) {
    try {
        return await requestCollectionAction('GET', collection, action, {}, props ); 
    }
    catch(err) {
        const e = getError( err ); 
        throw new Error( e.message ); 
    }
}

export async function postCollection(collection: string, action: string, body: Record<string, any>, props?: { tenant?: string, module?: string }) {
    try {
        return await requestCollectionAction('POST', collection, action, body, props ); 
    }
    catch(err) {
        const e = getError( err ); 
        throw new Error( e.message ); 
    }
}

async function requestCollectionAction(type: string, collection: string, action: string, body: Record<string, any>, props?: { tenant?: string, module?: string }) {
    let { tenant, module } = props ?? {};

    const assertRequired = (name: string, value: any) => {
        if ((value ?? '') === '') {
            throw new Error(`${name} is required in actions/local#requestCollectionAction`); 
        }
    }

    tenant = (tenant ?? Platform.TENANT_NAME) ?? '';

    assertRequired('tenant', tenant); 
    assertRequired('collection', collection); 
    assertRequired('action', action); 

    const resolveResult = ( resp: any ) => {
        const { data } = resp ?? {};
        return data; 
    }

    const client = mgmtAPI.createAxiosClient();
    const paths = ['/mgmt', tenant, module, collection, action];
    const path = paths.filter((item) => (item != null)).join("/");
    if ( type === 'GET' ) {
        return resolveResult( await client.get(path)); 
    } else {
        return resolveResult( await client.post(path, body)); 
    }
}


// 
// modules actions
// 
export async function getModule(moduleID: string, props?: { tenant?: string }) {
    try {
        if ( moduleID === 'list') { 
            throw new Error(`'${moduleID}' is not a valid moduleID`); 
        } 
        return await fetchModuleData(moduleID, props);
    }
    catch(err) {
        const e = getError( err ); 
        throw new Error( e.message ); 
    }
}

export async function getModules(props?: { tenant?: string }) {
    try {
        return await fetchModuleData('list', props);
    }
    catch(err) {
        const e = getError( err ); 
        throw new Error( e.message ); 
    }
}

async function fetchModuleData(moduleID: string, props?: { tenant?: string }) {
    let { tenant } = props ?? {};

    const assertRequired = (name: string, value: any) => {
        if ((value ?? '') === '') {
            throw new Error(`${name} is required in actions/local#fetchModuleData`); 
        }
    }

    tenant = (tenant ?? Platform.TENANT_NAME) ?? '';

    assertRequired('tenant', tenant);
    assertRequired('moduleID', moduleID);

    const client = mgmtAPI.createAxiosClient();
    const path = `/modules/${tenant}/${moduleID}`;
    const resp = await client.get(path);
    const { data } = resp ?? {};
    return data;
}


// 
// service actions
// 
export async function resolveService(serviceID: string, action: string, props: { module: string, tenant?: string }) {
    try {
        return await requestServiceAction('resolve', serviceID, action, {}, props); 
    }
    catch(err) {
        const e = getError( err ); 
        throw new Error( e.message ); 
    }
}
export async function invokeService(serviceID: string, action: string, body: Record<string, any>, props: { module: string, tenant?: string }) {
    try {
        return await requestServiceAction('invoke', serviceID, action, body, props); 
    }
    catch(err) {
        const e = getError( err ); 
        throw new Error( e.message ); 
    }
}

async function requestServiceAction(type: string, serviceID: string, action: string, body: Record<string, any>, props: { module: string, tenant?: string }) {
    let { tenant, module } = props ?? {};    
    
    const assertRequired = (name: string, value: any) => {
        if ((value ?? '') === '') {
            throw new Error(`${name} is required in actions/local#requestServiceAction`); 
        }
    }
    
    tenant = (tenant ?? Platform.TENANT_NAME) ?? '';

    assertRequired('tenant', tenant); 
    assertRequired('module', module); 
    assertRequired('serviceID', serviceID); 
    assertRequired('action', action); 

    const client = mgmtAPI.createAxiosClient();
    const path = `/apis/${type}/${tenant}/${module}/${serviceID}/${action}`;

    const resolveResult = ( resp: any ) => {
        const { data } = resp ?? {};
        return data; 
    }

    if ( type === 'resolve' ) {
        return resolveResult( await client.get(path)); 
    } else { 
        return resolveResult( await client.post(path, body)); 
    } 
}


// 
// tenant actions
// 
export async function getTenant( tenant?: string ) {
    try {
        tenant = (tenant ?? Platform.TENANT_NAME) ?? '';
        if ( tenant === 'list') { 
            throw new Error(`'${tenant}' is not a valid tenant`); 
        } 
        return await requestTenantAction(tenant);
    }
    catch(err) {
        const e = getError( err ); 
        throw new Error( e.message ); 
    }
}
export async function getTenants() {
    try {
        return await requestTenantAction('list');
    }
    catch(err) {
        const e = getError( err ); 
        throw new Error( e.message ); 
    }
}
async function requestTenantAction(tenant: string) {

    const assertRequired = (name: string, value: any) => {
        if ((value ?? '') === '') {
            throw new Error(`${name} is required in actions/local#requestTenantAction`); 
        }
    }

    assertRequired('tenant', tenant);

    const client = mgmtAPI.createAxiosClient();
    const path = `/tenants/${tenant}`;
    const resp = await client.get(path);
    const { data } = resp ?? {};
    return data;
}


// 
// datasource actions
// 
export async function getDataSource( dataSourceID: string, props?: { tenant?: string, module?: string }) {
    try {
        if ( dataSourceID === 'list') { 
            throw new Error(`'${dataSourceID}' is not a valid DataSource`); 
        } 
        return await requestDataSourceAction('GET', dataSourceID, props);
    }
    catch(err) {
        const e = getError( err ); 
        throw new Error( e.message ); 
    }
}
export async function getDataSources( props?: { tenant?: string, module?: string }) {
    try {
        return await requestDataSourceAction('GET', 'list', props);
    }
    catch(err) {
        const e = getError( err ); 
        throw new Error( e.message ); 
    }
}
async function requestDataSourceAction( type: string, dataSourceID: string, props?: { tenant?: string, module?: string }) {
    let { tenant, module } = props ?? {};

    const assertRequired = (name: string, value: any) => {
        if ((value ?? '') === '') {
            throw new Error(`${name} is required in actions/local#requestDataSourceAction`); 
        }
    }
    
    tenant = (tenant ?? Platform.TENANT_NAME) ?? '';
    
    assertRequired('tenant', tenant);
    assertRequired('dataSourceID', dataSourceID);

    const client = mgmtAPI.createAxiosClient();
    const paths = ['/datasources', tenant, module, dataSourceID];
    const path = paths.filter((item) => (item ?? null !== null)).join("/");

    const resolveResult = ( resp: any ) => {
        const { data } = resp ?? {};
        return data; 
    }

    if ( type === 'GET' ) {
        return resolveResult( await client.get(path)); 
    } else {
        throw new Error(`'${type}' not supported in actions/local#requestDataSourceAction`); 
    }
}
