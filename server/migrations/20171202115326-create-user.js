'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
          type: Sequelize.STRING,
          allowNull: false,
      },
      password: {
          type: Sequelize.STRING,
          allowNull: false,
      },
      admin: {
          type: Sequelize.BOOLEAN,
      },
      token: {
          type: Sequelize.STRING,
          allowNull: true,
    },
      verif: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
      },
        createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};