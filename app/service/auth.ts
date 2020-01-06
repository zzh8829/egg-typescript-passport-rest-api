import { Service } from "egg";
import { hash, compare } from "bcrypt";
import { sign } from "jsonwebtoken";

class Auth extends Service {
  async verifyUser(auth) {
    const { ctx } = this;

    console.log(auth);

    if (auth.provider === "local") {
      const username = auth.username;
      const user = await ctx.service.user.findByUsername(username);

      // process signup
      if (
        ctx.request.path === "/api/auth/signup" ||
        ctx.request.path === "/signup"
      ) {
        if (!user) {
          ctx.validate(
            {
              username: { type: "string", required: true },
              password: { type: "string", required: true }
            },
            auth
          );
          const passwordHash = await hash(auth.password, 10);

          return this.ctx.model.User.create({
            ...ctx.request.body,
            username: auth.username,
            password: passwordHash
          });
        }
      }

      // process login
      if (!user || !user.password) {
        return null;
      }
      if (!(await compare(auth.password, user.password))) {
        return null;
      }
      return user;
    } else if (auth.provider === "github") {
      const email = auth.profile.emails[0].value;
      const user = await ctx.service.user.findByUsername(email);
      if (!user) {
        return await this.ctx.model.User.create({
          username: email,
          displayName: auth.displayName
        });
      }
      return user;
    } else if (auth.provider === "jwt") {
      return await this.deserializeUser(auth);
    }
    return null;
  }

  async serializeUser(user) {
    return { id: user.id };
  }

  async deserializeUser(serailizedUser) {
    const user = await this.ctx.model.User.findByPk(serailizedUser.id);
    if (!user) {
      return null;
    }
    return {
      username: user.username,
      displayName: user.displayName
    };
  }

  async getToken() {
    return sign(await this.serializeUser(this.ctx.user), this.app.config.keys);
  }
}

module.exports = Auth;
