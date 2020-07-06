module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define("category", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        parent_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        freezeTableName: true
    });
    Category.associate = models => {
        Category.belongsToMany(models.video, {through: 'video_Category', as: 'video',
            foreignKey: 'categoryId'});
        Category.belongsToMany(models.article, {through: 'article_Category',as:'article',foreignKey: 'categoryId'});
    }
    return Category;
};
