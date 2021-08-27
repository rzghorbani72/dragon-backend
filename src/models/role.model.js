export default (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "role",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_type: {
        type: DataTypes.ENUM([
          "ordinary",
          "admin",
          "manager",
          "owner",
          "author",
        ]),
        defaultValue: "ordinary",
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      deletedAt: "destroyTime",
      indexes: [
        {
          unique: true,
          fields: ["userId"],
        },
      ],
    }
  );
  Role.associate = (models) => {
    Role.belongsTo(models.user, { foreignKey: "userId", constraints: false });
  };
  return Role;
};
