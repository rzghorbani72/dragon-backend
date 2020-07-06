module.exports = (sequelize, DataTypes) => {
    const UserSubscription = sequelize.define("user_subscription", {
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        planId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'subscription_plan',
                key: 'id'
            }
        },
        expiredAt:{
            type:DataTypes.DATE,
            allowNull:true,
            defaultValue:null
        }
    }, {
        freezeTableName: true
    });
    return UserSubscription;
};
