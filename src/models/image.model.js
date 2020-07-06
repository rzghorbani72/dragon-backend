module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define("image", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        url: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        file_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        file_address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mime_type: {
            type: DataTypes.STRING
        }
    }, {
        freezeTableName: true
    });
    Image.associate = async models => {
        await Image.hasOne(models.user);
        await Image.hasOne(models.article);
        await Image.hasOne(models.course);
        await Image.hasOne(models.video);
    }
    return Image;
};
