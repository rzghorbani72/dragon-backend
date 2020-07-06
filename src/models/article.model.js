module.exports = (sequelize, DataTypes) => {
    const Article = sequelize.define("article", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    }, {
        freezeTableName: true
    });
    Article.associate = models => {
        Article.belongsTo(models.image, {foreignKey: 'imageId', constraints: false});
        Article.belongsToMany(models.tag, {through: 'article_tag', as: 'tag', foreignKey: 'articleId'});
        Article.belongsToMany(models.category, {through: 'article_category', as: 'category', foreignKey: 'articleId'});
    }
    return Article;
};
