export default (sequelize, DataTypes) => {
    const EmailProviderVerification = sequelize.define("email_provider_verification", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        token: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        full_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        given_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        image_url: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        provider: {
            type: DataTypes.ENUM(['google', 'yahoo', 'linkedIn', 'github', 'facebook','none']),
            defaultValue: 'none',
        },
        verified:{
            type: DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue: false
        },
    }, {
        freezeTableName: true,
        paranoid: true,
        deletedAt: 'destroyTime',
        indexes: [
            {
                unique: true,
                fields: ['userId']
            }
        ]
    });
    EmailProviderVerification.associate = models => {
        EmailProviderVerification.belongsTo(models.user, {foreignKey: 'userId', constraints: false});
    }
    return EmailProviderVerification;
};
