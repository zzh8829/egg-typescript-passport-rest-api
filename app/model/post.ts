import { Application } from "egg";

export default function(app: Application) {
  const { STRING, INTEGER } = app.Sequelize;

  const Post = app.model.define("post", {
    title: STRING(30),
    content: STRING(255),
    user_id: INTEGER
  });

  return class extends Post {
    static associate() {
      app.model.Post.belongsTo(app.model.User, {
        as: "user",
        foreignKey: "user_id"
      });
    }

    static async findByIdWithUser(id: number, userId: number) {
      return await this.findOne({
        where: { id, user_id: userId }
      });
    }
  };
}
