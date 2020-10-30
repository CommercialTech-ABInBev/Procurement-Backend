module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Categories', [
    {
      name: 'Business Service',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Direct Raw Materials',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Energy & Fluids',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Institutional',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Leases & Rentals',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Logistics Support',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Maintenance',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Marketing & Advertising',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Office Utilities',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Packaging & Containers',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'People',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Sales Support',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Technology',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Transport',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Travel',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Others',
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ]),

  down: (queryInterface) => queryInterface.bulkDelete('Categories', null, {})
};
