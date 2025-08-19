import AxiosBuilder, { AxiosBuilderCallback } from "../axios/axios-builder";
import { Platform } from "../common/platform";

const __LOCAL_API_KEY__ = "4e3b5a2c-9c74-4e10-9c76-3a3deec6d3c2";

const createAxiosClient = () => {
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
        console.log("config.url ====> ", config.url);
      }

      if (!config.url.startsWith("/")) {
        config.url = `/${config.url}`;
      }

      console.log(`localAPI requestPath: ${config.url}`);
    }

    // Add the local API key header
    if (config.headers) {
      config.headers["X-LOCAL_API_KEY"] = __LOCAL_API_KEY__;
      //   console.log("Headers being sent:", config.headers);
    }
  };

  return AxiosBuilder.build({ callback });
};

const localAPI = {
  client: createAxiosClient(),

  createAxiosClient,

  isPermitted: (req: any) => {
    // console.log(req);
    if (!req) return false;

    let reqApiKey = null;
    console.log("req.headers", req.headers["X-LOCAL_API_KEY"]);
    if ("nextUrl" in req) {
      // this is NextRequest object
      reqApiKey = req.headers.get("X-LOCAL_API_KEY");
      console.log("Passing next url", reqApiKey);
    } else {
      reqApiKey = req.get("X-LOCAL_API_KEY");
      if (!reqApiKey) {
        reqApiKey = req.headers["X-LOCAL_API_KEY"];
      }
      console.log("Passing default", reqApiKey);
    }

    return __LOCAL_API_KEY__ === reqApiKey;
  },

  addCustomHeaders: (headers: any) => {
    headers.set("X-LOCAL_API_KEY", __LOCAL_API_KEY__);
  },
};

export default localAPI;
