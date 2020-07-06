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
        freezeTableName: true
    });
    return videoTag;
};
