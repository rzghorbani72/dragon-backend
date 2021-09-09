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
        unique: true,
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
      deletedAt: "destroyTime",
      onDelete: 'restrict', onUpdate: 'restrict',
      indexes: [
        {
          unique: true,
          fields: ["id", "name"],
        },
      ],
    }
  );
  Category.associate = (models) => {
    Category.belongsToMany(models.video, {
      through: "video_category",
      as: "video",
      foreignKey: "categoryId",
      otherKey: "videoId",
    });
    Category.belongsToMany(models.course, {
      through: "course_category",
      as: "course",
      foreignKey: "categoryId",
      otherKey: "courseId",
    });
  };
  return Category;
};
