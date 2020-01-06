import { Controller } from "egg";
import { URL } from "url";

export default class AuthController extends Controller {
  public async getToken() {
    this.ctx.response.body = {
      token: await this.service.auth.getToken()
    };
  }

  public async redirectWithToken() {
    const redirectURL = new URL(this.ctx.get("referer") || "/");
    redirectURL.searchParams.append(
      "token",
      await this.service.auth.getToken()
    );

    this.ctx.redirect(redirectURL.href);
  }

  public async logout() {
    this.ctx.logout();
    this.ctx.redirect(this.ctx.get("referer") || "/");
  }
}
