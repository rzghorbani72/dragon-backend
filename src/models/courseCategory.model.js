module.exports = (sequelize, DataTypes) => {
    const CourseCategory = sequelize.define("course_category", {
        courseId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'course',
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
        freezeTableName: true,
        paranoid: true,
        deletedAt: 'destroyTime'
    });
    CourseCategory.associate = models => {
        CourseCategory.belongsTo(models.course);
        CourseCategory.belongsTo(models.category);
    }
    return CourseCategory;
};
