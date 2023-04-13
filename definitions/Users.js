const Users = (sequelize, Datatypes) => {
    return sequelize.define(
        'users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Datatypes.INTEGER
            },
            name: {
                allowNull: false,
                type: Datatypes.STRING
            },
            age: {
                allowNull: false,
                type: Datatypes.INTEGER
            },
            password: {
                allowNull: false,
                type: Datatypes.STRING
            },
            email: {
                allowNull: false,
                unique: true,
                type: Datatypes.STRING
            },
            createdAt: {
                allowNull: false,
                type: Datatypes.DATE,
                defaultValue: Datatypes.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                allowNull: false,
                type: Datatypes.DATE,
                defaultValue: Datatypes.literal('CURRENT_TIMESTAMP'),
            },
        },
    );
  };
  
  module.exports = Users;
  