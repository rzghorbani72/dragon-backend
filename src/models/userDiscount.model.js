export default (sequelize, DataTypes) => {
  const UserDiscount = sequelize.define(
    "user_discount",
    {
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
      },
      discountId: {
        type: DataTypes.INTEGER,
        references: {
          model: "discount",
          key: "id",
        },
      },
      status: {
        type: DataTypes.ENUM(["appliedOnOrder", "usedInPayment"]),
        allowNull: false,
        defaultValue: "appliedOnOrder",
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      constraints: true,
      onDelete: "restrict",
      onUpdate: "restrict",
      deletedAt: "destroyTime",
      indexes: [
        {
          unique: true,
          fields: ["discountId", "userId"],
        },
      ],
    }
  );
  return UserDiscount;
};
