import { EggAppConfig, EggAppInfo, PowerPartial } from "egg";
import { Dialect } from "sequelize";

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      DB_PORT: number;
      DB_DIALECT: Dialect;
    }
  }
}

export default (_appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie/jwt sign key, should change to your own and keep security
  config.keys = process.env.SECRET_KEY || "PLACEHOLDER";

  config.security = {
    csrf: {
      ignore: /^\/api\//
    }
  };

  config.sequelize = {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT
  };

  config.passportGithub = {
    key: process.env.GITHUB_CLIENT_ID || "PLACEHOLDER",
    secret: process.env.GITHUB_CLIENT_SECRET || "PLACEHOLDER"
  };

  // add your egg config in here
  config.middleware = [];

  // add your special config in here
  const bizConfig = {};

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig
  };
};
