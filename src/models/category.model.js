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
        freezeTableName: true,
        paranoid: true,
        deletedAt: 'destroyTime'
    });
    Category.associate = models => {
        Category.belongsToMany(models.video, {through: 'video_category', as: 'video', foreignKey: 'categoryId'});
        Category.belongsToMany(models.video, {through: 'course_category', as: 'course', foreignKey: 'categoryId'});
        Category.hasMany(models.courseCategory);
        Category.belongsToMany(models.article, {through: 'article_category', as: 'article', foreignKey: 'categoryId'});
    }
    return Category;
};
