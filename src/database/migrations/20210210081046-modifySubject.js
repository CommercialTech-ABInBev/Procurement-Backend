module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Subjects', 'vendor', {
    type: Sequelize.STRING,
    allowNull: true
  }),
  down: (queryInterface) => queryInterface.removeColumn('Subjects', 'vendor')
};
