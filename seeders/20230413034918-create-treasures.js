'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('treasures', [
      {
        latitude: 14.54376481,
        longitude: 121.0199117,
        name: 'T1',
      },
      {
        latitude: 14.55320766,
        longitude: 121.0557745,
        name: 'T2',
      },
      {
        latitude: 14.54464357,
        longitude: 121.0203656,
        name: 'T3',
      },
      {
        latitude: 14.58726159,
        longitude: 120.9795048,
        name: 'T4',
      },
      {
        latitude: 14.57320327,
        longitude: 121.0230904,
        name: 'T5',
      },
      {
        latitude: 14.52311313,
        longitude: 121.0194573,
        name: 'T6',
      },
      {
        latitude: 14.60242292,
        longitude: 121.0115134,
        name: 'T7',
      },
      {
        latitude: 14.60857463,
        longitude: 121.0185514,
        name: 'T8',
      },
      {
        latitude: 14.49111434,
        longitude: 121.0437482,
        name: 'T9',
      },
      {
        latitude: 14.54455953,
        longitude: 121.1060883,
        name: 'T10',
      },
      {
        latitude: 14.58798141,
        longitude: 121.058208,
        name: 'T11',
      },
      {
        latitude: 14.54886493,
        longitude: 121.0336393,
        name: 'T12',
      },
      {
        latitude: 14.53715059,
        longitude: 120.9904302,
        name: 'T13',
      },
      {
        latitude: 14.52579666,
        longitude: 121.0208688,
        name: 'T14',
      },
      {
        latitude: 14.51709988,
        longitude: 120.9810021,
        name: 'T15',
      },
      {
        latitude: 14.50200687,
        longitude: 120.9916181,
        name: 'T16',
      },
      {
        latitude: 14.52112441,
        longitude: 121.0427714,
        name: 'T17',
      },
      {
        latitude: 14.47720766,
        longitude: 120.9867927,
        name: 'T18',
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('treasures', null, {});
  }
};
