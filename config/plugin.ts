import { EggPlugin } from "egg";

const plugin: EggPlugin = {
  routerPlus: {
    enable: true,
    package: "egg-router-plus"
  },

  validate: {
    enable: true,
    package: "egg-validate"
  },

  cors: {
    enable: true,
    package: "egg-cors"
  },

  sequelize: {
    package: "egg-sequelize",
    enable: true
  },

  passport: {
    enable: true,
    package: "egg-passport"
  },

  passportLocal: {
    enable: true,
    package: "egg-passport-local"
  },

  passportGithub: {
    enable: true,
    package: "egg-passport-github"
  }
};

export default plugin;
