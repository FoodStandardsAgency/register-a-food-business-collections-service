"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn("activities", "business_other_details", {
      type: Sequelize.STRING(1500),
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn("activities", "business_other_details", {
      type: Sequelize.STRING,
    });
  },
};
