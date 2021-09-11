export default (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "order",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      status: {
        type: DataTypes.ENUM(["submitted", "paid", "canceled"]),
        defaultValue: "submitted",
      },
      finalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      deletedAt: "destroyTime",
      onDelete: "restrict",
      onUpdate: "restrict",
      constraints: true,
    }
  );
  Order.associate = (models) => {
    Order.belongsTo(models.course, {
      as: "course",
      foreignKey: "courseId",
      constraints: true,
      onDelete: "restrict",
      onUpdate: "restrict",
    });
    Order.belongsTo(models.user, {
      as: "user",
      foreignKey: "userId",
      constraints: true,
      onDelete: "restrict",
      onUpdate: "restrict",
    });
    Order.belongsTo(models.discount, {
      as: "discount",
      foreignKey: "discountId",
      constraints: true,
      onDelete: "restrict",
      onUpdate: "restrict",
    });
  };
  return Order;
};
