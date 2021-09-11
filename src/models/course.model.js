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
      total_duration: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      visit_count: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
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
      featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      featured_order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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
