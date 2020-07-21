module.exports = (sequelize, DataTypes) => {
    const Tag = sequelize.define("tag", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        freezeTableName: true,
        paranoid: true,
        deletedAt: 'destroyTime',
    });
    Tag.associate = models => {
        Tag.belongsToMany(models.video, {
            through: 'video_tag', as: 'video',
            foreignKey: 'tagId'
        });
        Tag.belongsToMany(models.article, {
            through: 'article_tag', as: 'article',
            foreignKey: 'tagId'
        });
    }
    return Tag;
};
