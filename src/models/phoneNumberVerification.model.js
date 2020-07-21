module.exports = (sequelize, DataTypes) => {
    const PhoneNumberVerification = sequelize.define("phone_number_verification", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        verified:{
            type: DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue: false
        }
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
    PhoneNumberVerification.associate = models => {
        PhoneNumberVerification.belongsTo(models.user,{foreignKey:'userId',constraints:false});
    }
    return PhoneNumberVerification;
};
