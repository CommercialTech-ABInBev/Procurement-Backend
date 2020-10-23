module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    'Role',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      role: {
        type: DataTypes.ENUM('admin', 'supplier', 'staff'),
        allowNull: false,
        defaultValue: 'staff'
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {}
  );
  Role.associate = (models) => {
    Role.belongsToMany(models.User, {
      through: 'roleUser',
      as: 'users',
      foreignKey: 'roleId'
    });
  };
  return Role;
};
