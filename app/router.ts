import { Application } from "egg";

export default (app: Application) => {
  const { controller, router } = app;

  router.get("/", controller.home.index);

  // Session Based Authentication
  const sessionAuth = app.passport.authenticate("local", {
    successRedirect: undefined
  });
  app.post("/signup", sessionAuth, controller.auth.redirectWithToken);
  app.post("/login", sessionAuth, controller.auth.redirectWithToken);
  router.get("/logout", controller.auth.logout);

  const githubAuth = app.passport.authenticate("github", {
    successRedirect: undefined,
    scope: "user:email"
  });
  router.get("/passport/github", githubAuth);
  router.get(
    "/passport/github/callback",
    githubAuth,
    controller.auth.redirectWithToken
  );

  console.log(router.stack.map(x => [x.methods, x.path]));

  // Token Based Authentication
  const tokenAuthOpts = {
    successRedirect: undefined,
    failureRedirect: undefined,
    session: false
  };

  {
    const authRouter = router.namespace("/api/auth");

    const localAuth = app.passport.authenticate("local", tokenAuthOpts);
    authRouter.post("/signup", localAuth, controller.auth.getToken);
    authRouter.post("/login", localAuth, controller.auth.getToken);
  }

  // API protected by token
  {
    const apiRouter = router.namespace(
      "/api",
      app.passport.authenticate("jwt", tokenAuthOpts)
    );

    apiRouter.resources("user", "/user", controller.api.user);
    apiRouter.resources("post", "/post", controller.api.post);
  }
};
