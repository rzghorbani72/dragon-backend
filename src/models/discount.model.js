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
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(["all", "multiple", "single"]),
        defaultValue: "all",
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
    });
  };
  return Discount;
};
