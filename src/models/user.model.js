export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      birthday: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter your phone_number",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        validate: { isEmail: true },
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM([
          "owner",
          "manager",
          "admin",
          "author",
          "ordinary",
        ]),
        defaultValue: "ordinary",
      },
      phone_number_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true,
      },
      email_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      deletedAt: "destroyTime",
      onDelete: "restrict",
      onUpdate: "restrict",
      constraints: true,
      indexes: [
        {
          unique: true,
          fields: ["email", "phone_number"],
        },
      ],
    }
  );
  User.associate = (models) => {
    User.hasOne(models.discount);
    User.hasMany(models.loginData);
    User.hasMany(models.accessToken);
    User.hasMany(models.phoneNumberVerification);
    User.hasMany(models.emailProviderVerification);
  };
  return User;
};
