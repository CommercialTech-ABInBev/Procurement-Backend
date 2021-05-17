module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('JobFunctions', [
    {
      name: 'Solutions',
      directorEmail: 'Oluwafemi.akintilo@ng.ab-inbev.com',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Logistics',
      directorEmail: 'Harry.DeWet@ng.ab-inbev.com',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Procurement',
      directorEmail: 'charles.okorie@ng.ab-inbev.com',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'People',
      directorEmail: 'Marilyn.Maduka@ng.ab-inbev.com',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Supply',
      directorEmail: 'Tony.Agah@ng.ab-inbev.com',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Finance',
      directorEmail: 'Bruno.Zambrano@ng.ab-inbev.com',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Marketing',
      directorEmail: 'Tolulope.Adedeji@ng.ab-inbev.com',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Legal & Coperate Affairs',
      directorEmail: 'Temitope.Oguntokun@ng.ab-inbev.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]),

  down: (queryInterface) => queryInterface.bulkDelete('JobFunctions', null, {})
};
