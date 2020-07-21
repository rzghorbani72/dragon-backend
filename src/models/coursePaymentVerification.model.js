module.exports = (sequelize, DataTypes) => {
    const CoursePaymentVerification = sequelize.define("course_payment_verification", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        ref:{
            type:DataTypes.TEXT
        },
        payment_data:{
            type:DataTypes.TEXT
        }
    }, {
        freezeTableName: true,
        paranoid: true,
        deletedAt: 'destroyTime'
    });
    CoursePaymentVerification.associate = models => {
        CoursePaymentVerification.belongsTo(models.course, {foreignKey: 'courseId',constraints:false});
        CoursePaymentVerification.belongsTo(models.user, {foreignKey: 'userId',constraints:false});
    }
    return CoursePaymentVerification;
};
