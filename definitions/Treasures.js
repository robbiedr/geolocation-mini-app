const Treasures = (sequelize, Datatypes) => {
    return sequelize.define(
        'treasures', {
            id: {
              type: Datatypes.INTEGER,
              primaryKey: true,
              autoIncrement: true,
            },
            latitude: {
              type: Datatypes.FLOAT,
              allowNull: false
            },
            longitude: {
              type: Datatypes.FLOAT,
              allowNull: false
            },
            name: {
              type: Datatypes.STRING,
              allowNull: false
            },
            createdAt: {
              allowNull: false,
              type: Datatypes.DATE,
              defaultValue: Datatypes.NOW,
            },
            updatedAt: {
              allowNull: false,
              type: Datatypes.DATE,
              defaultValue: Datatypes.NOW,
            },
        },
    );
  };
  
  module.exports = Treasures;
  