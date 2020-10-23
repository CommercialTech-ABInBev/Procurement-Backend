module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Roles', [{
    role: 'admin',
    description: 'This is a company admin, it has extensive priviledge in the application',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    role: 'supplier',
    description: 'This is a supplier, has supplier priviledge in the application',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    role: 'staff',
    description: 'procurement staff priviledges in this application',
    createdAt: new Date(),
    updatedAt: new Date()
  }
  ]),

  down: (queryInterface) => queryInterface.bulkDelete('Roles', null, {})
};
