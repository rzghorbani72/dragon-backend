export default (sequelize, DataTypes) => {
  const VisitedVideos = sequelize.define(
    "visited_videos",
    {
      videoId: {
        type: DataTypes.INTEGER,
        references: {
          model: "file",
          key: "uid",
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
