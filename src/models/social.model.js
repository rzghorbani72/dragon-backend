module.exports = (sequelize, DataTypes) => {
    const Social = sequelize.define("user_social", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        provider: {
            type: DataTypes.ENUM(['google', 'yahoo', 'instagram', 'telegram', 'linkedIn', 'github', 'facebook', 'none']),
            defaultValue: 'none'
        }
    }, {
        freezeTableName: true,
        paranoid: true,
        deletedAt: 'destroyTime',
        indexes: [
            {
                unique: true,
                fields: ['address']
            }
        ]
    });
    Social.associate = models => {
        Social.belongsTo(models.user, {foreignKey: "userId", constraints: false});
    }
    return Social;
};
