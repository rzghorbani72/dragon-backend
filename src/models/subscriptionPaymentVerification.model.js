module.exports = (sequelize, DataTypes) => {
    const SubscriptionPaymentVerification = sequelize.define("subscription_payment_verification", {
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
        freezeTableName: true
    });
    SubscriptionPaymentVerification.associate = models => {
        SubscriptionPaymentVerification.hasMany(models.subscriptionPlan, {foreignKey: 'planId',constraints: false});
        SubscriptionPaymentVerification.belongsTo(models.user, {foreignKey: 'userId',constraints: false});
    }
    return SubscriptionPaymentVerification;
};
