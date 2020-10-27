module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Categories', [
    {
      name: 'Business Service',
      subCategories: JSON.stringify(['Audit', 'Consultant', 'Expert', 'Insurance', 'Legal', 'Outside Counsel']),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Direct Raw Materials',
      subCategories: JSON.stringify(['Barley-Coperative', 'Brewing Syrups', 'Cleaning Products', 'Corn', 'Enzymes', 'Filtration-Diatomaceous Earth', 'Flavors', 'Foodgrade Chemicals', 'Malt', 'Other Auxiliaries', 'Other Raw Materials', 'Rice', 'Sorghum', 'Sugar', 'Waste Treat Products']),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Energy & Fluids',
      subCategories: JSON.stringify(['CO2', 'Electricity', 'Energy & Fluids', 'Liquid Fuels', 'Natural Gas', 'Other Energy & Fluids']),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Institutional',
      subCategories: JSON.stringify(['Coperative Affairs', 'Coperative Events', 'Industry Associations', 'Institutional', 'Legally Required Communication', 'Memberships', 'Subcriptions']),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Leases & Rentals',
      subCategories: JSON.stringify(['Lease of Equipment', 'Lease of Real Estate']),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Logistics Support',
      subCategories: JSON.stringify(['Lease/Rentals Of Handling and Storage Equipment', 'Logistics Support', 'Material Of Handling and Storage Equipment', 'Shipping Materials', 'Third Party Logistics Services', 'Warehousing']),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Maintenance',
      subCategories: JSON.stringify(['3rd Party Labour', 'Buildings & Facilities', 'Commericial Equip & Machinery', 'Industrial Equip & Machinery', 'Laboratory Equipment', 'Production Supplies']),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Marketing & Advertising',
      subCategories: JSON.stringify(['Advertising Production', 'Brand Events', 'Digital Production', 'Market Research', 'Marketing', 'Media Buying', 'Other Marketing', 'Sponsorship']),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Office Utilities',
      subCategories: JSON.stringify(['Office Supplies', 'Office Utilities', 'Postage/Courier', 'Water', 'Administrative Support', 'Cleaning', 'Document & Archiving Services', 'Laboratory Services', 'Recycling/Waste Cost', 'Security', 'Services']),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Packaging & Containers',
      subCategories: JSON.stringify(['Cans & Can Lids', 'Corrugated', 'Crates', 'Films', 'Labels', 'Metal Closures', 'Other Packaging', 'Ow Bottles', 'Pallets', 'Returning Bottles']),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'People',
      subCategories: JSON.stringify(['(Inter)national Mobility', 'Catering/Cafeteria/Vending', 'Facility Benefit', 'Health Benefits & life Insurance', 'People', 'PPE (Personal Protective Equipment) & Uniforms', 'Recruitment', 'Severances', 'Temps', 'Training']),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Sales Support',
      subCategories: JSON.stringify(['Fridges & Coolers', 'Draught Equipment Installation', 'Direct Trade Marketing (POCM & Services)', 'Sales Host']),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Technology',
      subCategories: JSON.stringify(['Application Licences Maintenance', 'Application Support', 'Other Technlogy', 'Telecom - Data Communication Services', 'Telecom - Telephone Services', 'Workplace - It Supplies & Other Peripheral', 'Workplace - Mobile Services', 'Workplace - Print and Copy Services']),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Transport',
      subCategories: JSON.stringify(['Lease/Rental of Transportation Fleet', 'Ocean', 'Road - 1st Tier', 'Road - 2nd Tier', 'Transportation Fleet Maintenance', 'Transportation Fuel']),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Travel',
      subCategories: JSON.stringify(['Cost Travel Provider', 'Local Transportaion', 'Airfare', 'Lodging']),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Others',
      subCategories: JSON.stringify(['Others']),
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ]),

  down: (queryInterface) => queryInterface.bulkDelete('Categories', null, {})
};
