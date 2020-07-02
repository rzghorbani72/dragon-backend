module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        full_name: {
            type:DataTypes.STRING,
            allowNull:true,
            defaultValue:null,
        },
        birthday: {
            type:DataTypes.DATE,
            allowNull:true,
            defaultValue:null,
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull:false,
            validate: {
                notNull: {
                    msg: 'Please enter your phone_number'
                }
            }
        },
        email_verified: {
            type: DataTypes.ENUM(['company', 'manual', 'none']),
            validate: {isEmail: true},
            defaultValue:'none'
        }
    },{
        freezeTableName:true
    });
    User.associate = models => {
        User.hasMany(models.image, { as: "image" });
    }
    return User;
};
