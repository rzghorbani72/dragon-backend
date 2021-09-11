export default (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    "payment",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      gateway_link: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      bankResponse: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      callBackUrl: {
        type: DataTypes.TEXT,
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
    }
  );
  Payment.associate = (models) => {
    Payment.belongsTo(models.order, {
      as: "order",
      foreignKey: "orderId",
      constraints: true,
      onDelete: "restrict",
      onUpdate: "restrict",
    });
    Payment.belongsTo(models.user, {
      as: "user",
      foreignKey: "userId",
      constraints: true,
      onDelete: "restrict",
      onUpdate: "restrict",
    });
  };
  return Payment;
};
