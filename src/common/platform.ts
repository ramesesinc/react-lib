
const resolveContextPath = (): string => {
    const path = ((process.env.CONTEXT_PATH || process.env.NEXT_PUBLIC_APP_CONTEXT_PATH) || "");
    if (path && !path.startsWith("/")) {
        return `/${path}`;
    }
    return path;
}

const resolvePathNameImpl = (pathname: string) => {
    if (pathname.startsWith('//')) {
        return resolvePathNameImpl(pathname.substring(1));
    } else if (pathname.startsWith('/')) {
        return pathname;
    } else {
        return `/${pathname}`;
    }
}

export const Platform = {

    PLATFORM_NAME: (process.env.PLATFORM_NAME ?? null),

    TENANT_NAME: ((process.env.TENANT_NAME || process.env.NEXT_PUBLIC_TENANT_NAME) ?? null),

    MGMT_SERVER_URI: ((process.env.MGMT_SERVER_URI || process.env.NEXT_PUBLIC_MGMT_SERVER_URI) ?? null),

    CONTEXT_PATH: resolveContextPath(),

    env: (name: string, defaultValue?: any) => {
        const key_1 = name;
        const key_2 = `next_public_${key_1}`.toUpperCase();
        const value = (process.env[key_1] || process.env[key_2]);
        return (value ?? defaultValue);
    },

    resolvePathName: (pathname: string) => {
        return resolvePathNameImpl(`${resolveContextPath()}${pathname}`); 
    }
};

// export default Platform;
