"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("metadata", "feedback1", Sequelize.STRING),
    ]);
  },
  down: (queryInterface) => {
    return Promise.all([queryInterface.removeColumn("metadata", "feedback1")]);
  },
};
