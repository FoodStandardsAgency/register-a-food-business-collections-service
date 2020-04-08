"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      "registrations",
      "council",
      Sequelize.STRING
    );
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn("registrations", "council");
  },
};
