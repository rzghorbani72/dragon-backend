module.exports = (sequelize, DataTypes) => {
    const ArticleCategory = sequelize.define("article_category", {
        articleId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'article',
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
        freezeTableName: true
    });
    return ArticleCategory;
};
