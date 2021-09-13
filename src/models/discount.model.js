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
    Discount.belongsTo(models.user, {
      foreignKey: "userId",
      constraints: true,
      onDelete: "restrict",
      onUpdate: "restrict",
    });
  };
  return Discount;
};
