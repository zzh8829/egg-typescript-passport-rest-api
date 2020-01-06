import { Application, IBoot } from "egg";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

export default class AppBootHook implements IBoot {
  private readonly app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  async didLoad() {
    const { app } = this;
    if (app.config.env === "local" || app.config.env === "unittest") {
      // await app.model.sync({ force: true });
    }

    app.passport.verify((ctx, user) => ctx.service.auth.verifyUser(user));
    app.passport.serializeUser((ctx, user) =>
      ctx.service.auth.serializeUser(user)
    );
    app.passport.deserializeUser((ctx, user) =>
      ctx.service.auth.deserializeUser(user)
    );

    app.passport.use(
      "jwt",
      new JwtStrategy(
        {
          passReqToCallback: true,
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: app.config.keys
        },
        (req, user, done) =>
          app.passport.doVerify(req, { ...user, provider: "jwt" }, done)
      )
    );
  }
}
