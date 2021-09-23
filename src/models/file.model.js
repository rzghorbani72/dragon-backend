export default (sequelize, DataTypes) => {
  const File = sequelize.define(
    "file",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
      },
      uid: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        unique: true,
      },
      originalname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      encoding: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      duration_seconds: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      filename: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      destination: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      size: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      type: {
        type: DataTypes.ENUM(["image", "video"]),
        defaultValue: "image",
        allowNull: false,
      },
      mimetype: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      uploaderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isPrivate: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      freezeTableName: true,
    }
  );
  File.associate = async (models) => {
    await File.belongsTo(models.course, {
      as: "course",
      foreignKey: "courseId",
      constraints: true,
      onDelete: "restrict",
      onUpdate: "restrict",
    });
  };
  return File;
};
