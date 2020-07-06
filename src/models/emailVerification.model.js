module.exports = (sequelize, DataTypes) => {
    const EmailVerification = sequelize.define("email_verification", {
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
        email:{
            type:DataTypes.STRING,
            validate:{isEmail:true},
            allowNull:true
        }
    },{
        freezeTableName:true
    });
    EmailVerification.associate = models => {
        EmailVerification.belongsTo(models.user,{foreignKey:'userId',constraints:false});
    }
    return EmailVerification;
};
