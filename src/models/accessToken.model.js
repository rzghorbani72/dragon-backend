module.exports = (sequelize, DataTypes) => {
    const AccessToken = sequelize.define("access_token", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        token: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        forWhat: {
            type: DataTypes.ENUM(['login', 'watchingVideo'])
        },
        ipAddress: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    }, {
        freezeTableName: true
    });
    AccessToken.associate = models => {
        AccessToken.belongsTo(models.user, {foreignKey: 'userId',constraints: false});
        AccessToken.belongsTo(models.video, {foreignKey: 'videoId',constraints: false});
    }
    return AccessToken;
};
