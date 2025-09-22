import fs from "fs";
import path from "path";
import AxiosBuilder from "../axios/axios-builder";
import { Platform } from "../common/platform";

const createAxiosClient = () => {
  const MGMT_SERVER_URI = Platform.MGMT_SERVER_URI;
  if (!MGMT_SERVER_URI) {
    throw new Error("'NEXT_PUBLIC_MGMT_SERVER_URI' env variable is not set");
  }

  return AxiosBuilder.build({
    baseURL: MGMT_SERVER_URI.trim(),
    callback: (config) => {
      console.log("mgmtAPI requestURL => ", `${config.baseURL}${config.url}`);
      // console.log("mgmtAPI config.baseURL", config.baseURL );
      // console.log("mgmtAPI config.url", config.url );
    },
  });
};

const mgmtAPI = {
  client: createAxiosClient(),

  createAxiosClient,

  findMgmtResource: (filePath: string) => {
    let normalized = filePath.startsWith("/") ? filePath : `/${filePath}`;
    const envFilePath = path.resolve(process.cwd(), ".env");
    const mgmtFilePath = path.resolve(path.dirname(envFilePath), `mgmt${normalized}`);
    console.log("mgmtFilePath ===> ", mgmtFilePath);

    if (fs.existsSync(mgmtFilePath)) {
      const text = (fs.readFileSync(mgmtFilePath, "utf-8") ?? "").trim();
      if (text && text.length > 0) {
        if (!(text.startsWith("{") && text.endsWith("}"))) {
          throw new Error(`Invalid JSON data format for ${mgmtFilePath}`);
        }
        return JSON.parse(text);
      }
    }

    return null;
  },  
};

export default mgmtAPI;
