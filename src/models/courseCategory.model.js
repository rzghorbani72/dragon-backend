export default (sequelize, DataTypes) => {
  const CourseCategory = sequelize.define(
    "course_category",
    {
      courseId: {
        type: DataTypes.INTEGER,
        references: {
          model: "course",
          key: "id",
        },
      },
      categoryId: {
        type: DataTypes.INTEGER,
        references: {
          model: "category",
          key: "id",
        },
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      onDelete: "restrict",
      onUpdate: "restrict",
      deletedAt: "destroyTime",
    }
  );
  return CourseCategory;
};
