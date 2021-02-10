module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn(
      'Subjects',
      'adminRead',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      }
    ),
    queryInterface.addColumn(
      'Subjects',
      'vendorRead',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      }
    ),
  ]),

  down: (queryInterface) => Promise.all([
    queryInterface.removeColumn('Subjects', 'adminRead'),
    queryInterface.removeColumn('Subjects', 'vendorRead'),
  ])
};
