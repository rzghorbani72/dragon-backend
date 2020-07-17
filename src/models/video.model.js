module.exports = (sequelize, DataTypes) => {
    const Video = sequelize.define("video", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        file_address: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        file_name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        duration: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        visit_count: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        sale: {
            type: DataTypes.ENUM(['free', 'forSubscription', 'forSale', 'inherit']),
            defaultValue: 'inherit'
        },
        order: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        }

    }, {
        freezeTableName: true
    });
    Video.associate = models => {
        Video.belongsTo(models.course, {foreignKey: 'courseId', constraints: false});
        Video.belongsTo(models.image, {foreignKey: 'imageId', constraints: false});
        Video.belongsToMany(models.category, {
            through: 'video_category', as: 'category',
            foreignKey: 'videoId'
        });
        Video.belongsToMany(models.tag, {
            through: 'video_tag', as: 'tag',
            foreignKey: 'videoId'
        });
    }
    return Video;
};