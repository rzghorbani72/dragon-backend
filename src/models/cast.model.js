module.exports = (sequelize, DataTypes) => {
    const Cast = sequelize.define("cast", {
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
        file_address: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        file_name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        duration: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        visit_count: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        order: {
            type: DataTypes.INTEGER,
            defaultValue:0,
        },
        format: {
            type: DataTypes.ENUM(['voice', 'video']),
            allowNull: false,
            defaultValue: 'voice'
        },
        mime: {
            type: DataTypes.STRING,
            defaultValue: 'voice/mp3'
        }
    }, {
        freezeTableName: true,
        paranoid: true,
        deletedAt: 'destroyTime'
    });
    return Cast;
};
