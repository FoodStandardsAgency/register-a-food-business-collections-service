"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      "activities",
      "business_other_details",
      Sequelize.STRING
    );
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn("activities", "business_other_details");
  },
};
