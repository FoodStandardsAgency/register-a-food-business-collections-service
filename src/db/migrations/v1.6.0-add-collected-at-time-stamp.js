"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      "registrations",
      "collected_at",
      Sequelize.STRING
    );
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn("registrations", "collected_at");
  },
};
