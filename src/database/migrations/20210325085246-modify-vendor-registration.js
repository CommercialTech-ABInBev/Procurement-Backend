module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn(
      'VendorRegistrations',
      'approvalStatus',
      {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pending',
      }
    ),
    queryInterface.addColumn(
      'VendorRegistrations',
      'comment',
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    ),
    queryInterface.addColumn(
      'VendorRegistrations',
      'approvedBy',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    ),
  ]),

  down: (queryInterface) => Promise.all([
    queryInterface.removeColumn('VendorRegistrations', 'approvalStatus'),
    queryInterface.removeColumn('VendorRegistrations', 'comment'),
    queryInterface.removeColumn('VendorRegistrations', 'approvedBy'),
  ])
};
