import { Application } from "egg";

export default (app: Application) => {
  const { Sequelize } = app;

  const User = app.model.define(
    "user",
    {
      username: { type: Sequelize.STRING(255), allowNull: false },
      password: Sequelize.STRING(255),
      displayName: Sequelize.STRING(255)
    },
    {
      indexes: [{ unique: true, fields: ["username"] }]
    }
  );

  return class extends User {
    public username: string;
    public displayName: string;

    static associate() {
      app.model.User.hasMany(app.model.Post, { as: "posts" });
    }
  };
};
