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
        defaultValue: "en",
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      sale: {
        type: DataTypes.ENUM(["free", "forSubscription", "forSale", "inherit"]),
        defaultValue: "inherit",
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
      indexes: [
        {
          unique: true,
          fields: ["title"],
        },
      ],
    }
  );
  Course.associate = (models) => {
    Course.belongsTo(models.image, {
      foreignKey: "imageId",
      constraints: false,
    });
    Course.belongsTo(models.user, {
      foreignKey: "authorId",
      constraints: false,
    });
    Course.belongsToMany(models.category, {
      through: "course_category",
      as: "category",
      foreignKey: "courseId",
    });
    Course.hasMany(models.courseCategory);
    Course.hasOne(models.coursePaymentVerification);
    Course.hasMany(models.video);
  };
  return Course;
};
