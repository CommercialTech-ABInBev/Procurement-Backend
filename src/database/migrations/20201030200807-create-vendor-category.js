module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('VendorCategories', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    subCategory: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    vendorId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'VendorDetails',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    categoryId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: (queryInterface) => queryInterface.dropTable('VendorCategories')
};
