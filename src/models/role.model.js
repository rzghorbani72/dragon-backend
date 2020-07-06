module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define("user_social", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_type: {
            type: DataTypes.ENUM(['ordinary', 'admin','manager','owner','teacher']),
            defaultValue:'ordinary'
        }
    },{
        freezeTableName:true
    });
    Role.associate = models => {
        Role.belongsTo(models.user, { foreignKey: "userId" ,constraints: false});
    }
    return Role;
};
