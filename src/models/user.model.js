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
        email: {
            type: DataTypes.STRING,
            validate: {isEmail: true},
            allowNull: true
        },
        activation: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        email_verified: {
            type: DataTypes.ENUM(['company', 'manual', 'none']),
            defaultValue: 'none'
        },
        // createdAt: {
        //     type: DataTypes.DATE,
        //     get() {
        //         return moment(this.getDataValue('createdAt')).utc().format("yyyy-MM-dd'T'HH:mm:ss'Z'");
        //     }
        // },
        // updatedAt: {
        //     type: DataTypes.DATE,
        //     get() {
        //         return moment(this.getDataValue('updatedAt')).utc().format("yyyy-MM-dd'T'HH:mm:ss'Z'");
        //     }
        // }
    }, {
        freezeTableName: true,
        paranoid: true,
        deletedAt: 'destroyTime',
        indexes: [
            {
                unique: true,
                fields: ['email', 'phone_number']
            }
        ]
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
        User.hasMany(models.emailProviderVerification);
        User.hasMany(models.subscriptionPaymentVerification);
    }
    return User;
};
