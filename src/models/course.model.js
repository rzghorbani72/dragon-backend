module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define("course", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        total_duration:{
            type:DataTypes.STRING,
            allowNull: false,
        },
        visit_count:{
            type:DataTypes.INTEGER,
            defaultValue:1,
        },
        language:{
            type:DataTypes.ENUM(['fa','en','dubbed']),
            defaultValue:'en'
        },
        is_active:{
            type:DataTypes.BOOLEAN,
            defaultValue: true
        },
        sale:{
            type:DataTypes.ENUM(['free','forSubscription','forSale','inherit']),
            defaultValue:'inherit'
        },
        order:{
            type:DataTypes.INTEGER,
            defaultValue: 0,
        },
        featured:{
            type:DataTypes.BOOLEAN,
            defaultValue:false,
        },
        featured_order:{
            type:DataTypes.INTEGER,
            defaultValue:0
        }
    }, {
        freezeTableName: true
    });
    Course.associate = models => {
        Course.belongsTo(models.image,{foreignKey: 'imageId',constraints: false});
        Course.belongsTo(models.user,{foreignKey: 'authorId',constraints: false});
        Course.belongsTo(models.publisher,{foreignKey: 'publisherId',constraints: false});
        Course.hasOne(models.coursePaymentVerification);
        Course.hasMany(models.video);

    }
    return Course;
};