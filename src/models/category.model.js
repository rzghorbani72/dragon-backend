export default (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "category",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      parent_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      type: {
        type: DataTypes.ENUM(["category", "folder"]),
        defaultValue: "category",
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      deletedAt: "destroyTime",
    }
  );
  Category.associate = (models) => {
    Category.belongsToMany(models.video, {
      through: "video_category",
      as: "video",
      foreignKey: "categoryId",
    });
    Category.belongsToMany(models.video, {
      through: "course_category",
      as: "course",
      foreignKey: "categoryId",
    });
    Category.hasMany(models.courseCategory);
  };
  return Category;
};
