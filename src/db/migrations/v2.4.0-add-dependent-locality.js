"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        "operators",
        "operator_dependent_locality",
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        "premises",
        "establishment_dependent_locality",
        Sequelize.STRING
      ),
    ]);
  },
  down: (queryInterface) => {
    return Promise.all([
      queryInterface.removeColumn("operators", "operator_dependent_locality"),
      queryInterface.removeColumn(
        "premises",
        "establishment_dependent_locality"
      ),
    ]);
  },
};
