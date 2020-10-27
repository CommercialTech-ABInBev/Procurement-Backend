module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Vendors', [{
    vendorId: 'NigeriaOAAC0002',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    vendorId: 'NigeriaOAAC0001',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    vendorId: 'NigeriaOSHO0002',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    vendorId: 'NigeriaBGUL0001',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    vendorId: 'NigeriaOVIZ0001',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    vendorId: 'NigeriaBCOR0001',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    vendorId: 'NigeriaBGRA0001',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    vendorId: 'NigeriaBAVO0001',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    vendorId: 'NigeriaBPOL0001',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    vendorId: 'NigeriaBGOL0003',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    vendorId: 'NigeriaOERN5001',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    vendorId: 'NigeriaOKRO0001',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    vendorId: 'NigeriaOSON0001',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    vendorId: 'NigeriaONIG0001',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  ]),

  down: (queryInterface) => queryInterface.bulkDelete('Vendors', null, {})
};
