const Treasures = (sequelize, Datatypes) => {
    return sequelize.define(
        'money_values', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Datatypes.INTEGER
              },
              treasure_id: {
                allowNull: false,
                type: Datatypes.INTEGER,
                references: {
                  model: 'treasures',
                  key: 'id'
                }
              },
              amt: {
                allowNull: false,
                type: Datatypes.DECIMAL(10, 2)
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
  