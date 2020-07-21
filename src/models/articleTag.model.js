module.exports = (sequelize, DataTypes) => {
    const ArticleTag = sequelize.define("article_tag", {
        articleId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'article',
                key: 'id'
            }
        },
        tagId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'tag',
                key: 'id'
            }
        }
    }, {
        freezeTableName: true,
        paranoid: true,
        deletedAt: 'destroyTime'
    });
    ArticleTag.associate = models => {
        ArticleTag.belongsTo(models.article);
        ArticleTag.belongsTo(models.tag);
    }
    return ArticleTag;
};
