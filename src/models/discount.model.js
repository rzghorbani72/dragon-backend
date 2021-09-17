export default (sequelize, DataTypes) => {
  const Discount = sequelize.define(
    "discount",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.TEXT,
        unique: true,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(["percent", "amount"]),
        defaultValue: "percent",
      },
      user_apply_limitations: {
        type: DataTypes.ENUM(["one", "many"]),
        defaultValue: "many",
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
        allowNull: true,
        defaultValue: null,
      },
      value: {
        type: DataTypes.INTEGER,
        allowNull: null,
      },
      expiredAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      deletedAt: "destroyTime",
      onDelete: "restrict",
      onUpdate: "restrict",
    }
  );
  Discount.associate = (models) => {
    Discount.belongsToMany(models.user, {
      through: "user_discount",
      as: "user",
      foreignKey: "discountId",
      otherKey: "userId",
      constraints: true,
      onDelete: "restrict",
      onUpdate: "restrict",
    });
  };
  return Discount;
};
