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
    Image.associate = models => {
        Image.belongsTo(models.user, {
            foreignKey: "userId",
            as: "user",
        });
    }
    return Image;
};
