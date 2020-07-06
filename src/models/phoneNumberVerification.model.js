module.exports = (sequelize, DataTypes) => {
    const PhoneNumberVerification = sequelize.define("phone_number_verification", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        code:{
            type: DataTypes.STRING,
            allowNull:false,
        },
        verified:{
            type: DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue: false
        },
        retry:{
            type: DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue: false
        },

    },{
        freezeTableName:true
    });
    PhoneNumberVerification.associate = models => {
        PhoneNumberVerification.belongsTo(models.user,{foreignKey:'userId',constraints:false});
    }
    return PhoneNumberVerification;
};
