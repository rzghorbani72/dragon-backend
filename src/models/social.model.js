module.exports = (sequelize, DataTypes) => {
    const Social = sequelize.define("user_social", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        email_provider: {
            type: DataTypes.ENUM(['google', 'yahoo', 'linkedIn','github','facebook','none']),
            defaultValue:'none'
        }
    },{
        freezeTableName:true
    });
    Social.associate = models => {
        Social.belongsTo(models.user, { foreignKey: "userId" ,constraints: false});
    }
    return Social;
};
