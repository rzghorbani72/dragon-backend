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
        freezeTableName: true
    });
    return ArticleTag;
};
