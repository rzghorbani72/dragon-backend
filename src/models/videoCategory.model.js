module.exports = (sequelize, DataTypes) => {
    const VideoCategory = sequelize.define("video_category", {
        videoId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'video',
                key: 'id'
            }
        },
        categoryId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'category',
                key: 'id'
            }
        }
    }, {
        freezeTableName: true,
        paranoid: true,
        deletedAt: 'destroyTime'
    });
    VideoCategory.associate = models => {
        VideoCategory.belongsTo(models.video);
        VideoCategory.belongsTo(models.category);
    }
    return VideoCategory;
};
