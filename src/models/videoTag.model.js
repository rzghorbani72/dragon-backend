module.exports = (sequelize, DataTypes) => {
    const videoTag = sequelize.define("video_tag", {
        videoId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'video',
                key: 'id'
            }
        },
        TagId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'tag',
                key: 'id'
            }
        }
    }, {
        freezeTableName: true,
        paranoid: true,
        deletedAt: 'destroyTime',
    });
    videoTag.associate = models => {
        videoTag.belongsTo(models.video);
        videoTag.belongsTo(models.tag);
    }
    return videoTag;
};
