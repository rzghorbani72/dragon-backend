module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        full_name: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        birthday: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please enter your phone_number'
                }
            }
        },
        email_verified: {
            type: DataTypes.ENUM(['company', 'manual', 'none']),
            defaultValue: 'none'
        }
    }, {
        freezeTableName: true
    });
    User.associate = models => {
        User.belongsTo(models.image, {as: 'image', foreignKey: 'imageId', constraints: false});
        User.belongsToMany(models.subscriptionPlan, {
            through: 'user_subscription',
            as: 'subscription_plan',
            foreignKey: 'userId'
        });
        User.hasOne(models.discount);
        User.hasMany(models.loginData);
        User.hasMany(models.accessToken);
        User.hasMany(models.role);
        User.hasMany(models.social);
        User.hasMany(models.phoneNumberVerification);
        User.hasMany(models.emailVerification);
        User.hasMany(models.emailProviderVerification);
        User.hasMany(models.subscriptionPaymentVerification);
    }
    return User;
};
