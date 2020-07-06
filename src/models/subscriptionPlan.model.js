module.exports = (sequelize, DataTypes) => {
    const SubscriptionPlan = sequelize.define("subscription_plan", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        month: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        price: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        discount_percent: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        real_price: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        freezeTableName: true
    });
    // (async () => {
    //     await SubscriptionPlan.create({month: 1, price: '39000', real_price: '39000', discount_percent: 0})
    //     await SubscriptionPlan.create({month: 3, price: '89000', real_price: '117000', discount_percent: 24})
    //     await SubscriptionPlan.create({month: 6, price: '149000', real_price: '234000', discount_percent: 36})
    //     await SubscriptionPlan.create({month: 12, price: '269000', real_price: '468000', discount_percent: 43})
    // });
    SubscriptionPlan.associate = models => {
        SubscriptionPlan.hasOne(models.coursePaymentVerification);
        SubscriptionPlan.belongsToMany(models.user,{ through: 'user_subscription',as:'user',foreignKey:'planId' });
    }
    return SubscriptionPlan;
};
