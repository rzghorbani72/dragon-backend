export default (sequelize, DataTypes) => {
  const Course = sequelize.define(
    "course",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      total_duration_seconds: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      visit_count: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      level: {
        type: DataTypes.ENUM(["Novice", "Intermediate", "Advanced"]),
        defaultValue: "Novice",
      },
      language: {
        type: DataTypes.ENUM(["fa", "en", "dubbed"]),
        defaultValue: "fa",
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      primary_price: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      price: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      preparing_status: {
        type: DataTypes.ENUM(["pending", "finished"]),
        defaultValue: "fa",
      },
      featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      featured_order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      selected_image_uid: {
        type: DataTypes.BIGINT,
        defaultValue: null,
      },
    },

    {
      freezeTableName: true,
      paranoid: true,
      deletedAt: "destroyTime",
      onDelete: "restrict",
      onUpdate: "restrict",
      indexes: [
        {
          unique: true,
          fields: ["title"],
        },
      ],
    }
  );
  Course.associate = (models) => {
    Course.hasMany(models.file);
    Course.belongsTo(models.user, {
      foreignKey: "authorId",
      constraints: true,
      onDelete: "restrict",
      onUpdate: "restrict",
    });
    Course.belongsToMany(models.category, {
      through: "course_category",
      as: "category",
      foreignKey: "courseId",
      otherKey: "categoryId",
      constraints: true,
      onDelete: "restrict",
      onUpdate: "restrict",
    });
  };
  return Course;
};
