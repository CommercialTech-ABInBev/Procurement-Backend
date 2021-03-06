module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Media', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    imageUrl: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    vendorDetailsId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'VendorDetails',
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
  down: (queryInterface) => queryInterface.dropTable('Media')
};
