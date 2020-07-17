module.exports = (sequelize, DataTypes) => {
    const AccessToken = sequelize.define("access_token", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        token: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        code: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        retry: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        code_expire: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        token_expire: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        ipAddress: {
            type: DataTypes.TEXT,
            allowNull: true,
        }
    }, {
        freezeTableName: true
    });
    AccessToken.associate = models => {
        AccessToken.belongsTo(models.user, {foreignKey: 'userId', constraints: false});
    }
    return AccessToken;
};
