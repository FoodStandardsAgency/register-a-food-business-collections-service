"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      "registrations",
      "collected",
      Sequelize.BOOLEAN
    );
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn("registrations", "collected");
  },
};
