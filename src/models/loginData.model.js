export default (sequelize, DataTypes) => {
  const LoginData = sequelize.define(
    "login_data",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      loggedInAt: {
        type: DataTypes.DATE,
      },
      loggedOutAt: {
        type: DataTypes.DATE,
      },
      ipAddress: {
        type: DataTypes.TEXT,
      },
      nationality: {
        type: DataTypes.TEXT,
      },
    },
    {
      freezeTableName: true,
    }
  );
  LoginData.associate = (models) => {
    LoginData.belongsTo(models.user, {
      foreignKey: "userId",
      constraints: false,
    });
  };
  return LoginData;
};
