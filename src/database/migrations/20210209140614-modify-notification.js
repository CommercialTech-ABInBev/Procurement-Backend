module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn(
      'Notifications',
      'imageUrl',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
    ),
    queryInterface.addColumn(
      'Notifications',
      'subjectId',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Subjects',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    ),
  ]),

  down: (queryInterface) => Promise.all([
    queryInterface.removeColumn('Notifications', 'imageUrl'),
    queryInterface.removeColumn('Notifications', 'subjectId'),
  ])
};
