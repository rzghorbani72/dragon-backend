export default (sequelize, DataTypes) => {
  const VisitedVideos = sequelize.define(
    "liked_courses",
    {
      courseId: {
        type: DataTypes.INTEGER,
        references: {
          model: "course",
          key: "id",
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
      },
    },
    {
      freezeTableName: true,
      deletedAt: "destroyTime",
    }
  );
  return VisitedVideos;
};
