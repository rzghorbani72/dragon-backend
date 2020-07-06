module.exports = (sequelize, DataTypes) => {
    const Publisher = sequelize.define("publisher", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        publisher:{
            type:DataTypes.ENUM(['udemy','lynda','website']),
            allowNull:true,
            defaultValue:null
        }
    },{
        freezeTableName:true
    });
    Publisher.associate = models => {
        Publisher.hasMany(models.course);
    }
    return Publisher;
};
