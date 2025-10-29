import AxiosBuilder, { AxiosBuilderCallback } from "../axios/axios-builder";
import { Platform } from "../common/platform";

const __LOCAL_API_KEY__ = "4e3b5a2c-9c74-4e10-9c76-3a3deec6d3c2";

const createAxiosClient = (baseURL?: string) => {
  const contextPath = Platform.CONTEXT_PATH;

  const callback: AxiosBuilderCallback = (config) => {
    // Prepend the path if not already present
    if (config.url) {
      let urlPath = config.url;
      if (!urlPath.startsWith("/")) {
        urlPath = `/${urlPath}`;
      }

      const prePaths = [];

      if (contextPath && !urlPath.startsWith(contextPath)) {
        prePaths.push(contextPath);
      }

      if (!urlPath.startsWith("/localapi")) {
        prePaths.push("localapi");
      }

      if (prePaths && prePaths.length > 0) {
        const prefix = prePaths.join("/");
        prePaths.length = 0;

        config.url = `${prefix}${urlPath}`;
      }

      if (!config.url.startsWith("/")) {
        config.url = `/${config.url}`;
      }
    }

    // Add the local API key header
    if (config.headers) {
      config.headers["x-local_api_key"] = __LOCAL_API_KEY__;
    }
  };

  return AxiosBuilder.build({ callback, baseURL });
};

const findApiKey = (req: any, name: string) => {
  if ("nextUrl" in req) {
    // this is NextRequest object
    return req.headers.get(name);
  } else {
    let reqApiKey = req.get(name);
    if (!reqApiKey) {
      reqApiKey = req.headers[name];
    }
    return reqApiKey;
  }
};

const localAPI = {
  client: createAxiosClient(),

  createAxiosClient,

  isPermitted: (req: any, key?: string | null) => {
    if (key) {
      return __LOCAL_API_KEY__ === key;
    }

    if (!req) return false;

    let reqApiKey = findApiKey(req, "X-LOCAL_API_KEY");
    if (!reqApiKey) reqApiKey = findApiKey(req, "x_local_api_key");

    return __LOCAL_API_KEY__ === reqApiKey;
  },

  get: async (path: string) => {
    const req = {
      type: "GET",
      path: path,
      data: {},
    }
    const cl = createAxiosClient();
    const resp = await cl.post("/invoke", req);
    const { data: result } = resp ?? {};
    return result;
  },

  post: async (path: string, body: Record<string, any>) => {
    const req = {
      type: "POST",
      path: path,
      data: body,
    }
    const cl = createAxiosClient();
    const resp = await cl.post("/invoke", req);
    const { data: result } = resp ?? {};
    return result;
  },

  exec: async (path: string, body: Record<string, any>) => {
    const cl = createAxiosClient();
    const resp = await cl.post(path, body);
    const { data: result } = resp ?? {};
    return result;
  },
};

export default localAPI;
