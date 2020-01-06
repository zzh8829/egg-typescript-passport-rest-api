import { Controller } from "egg";

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;

    if (ctx.isAuthenticated()) {
      ctx.body = `
        <div>
            <h2> Welcome </h2>
            <hr><p> Hello: ${ctx.user.displayName ||
              ctx.user.username} | <a href="/logout">Logout</a></p>
            <pre><code>${JSON.stringify(ctx.user, null, 2)}</code></pre>
            <hr>
        </div>
      `;
    } else {
      ctx.body = `
        <h2> Welcome </h2>
        <form method="POST">
            <div>
                <label>Email:</label>
                <input type="text" name="username" />
                <br/>
            </div>
            <div>
                <label>Password:</label>
                <input type="password" name="password" />
            </div>
            <button type="submit" formaction="/signup?_csrf=${ctx.csrf}">Signup</button>
            <button type="submit" formaction="/login?_csrf=${ctx.csrf}">Login</button>
        </form>
        <form action="/passport/github" method="GET">
          <div>
              <input type="submit" value="Login with Github" />
          </div>
        </form>
      `;
    }
  }
}
