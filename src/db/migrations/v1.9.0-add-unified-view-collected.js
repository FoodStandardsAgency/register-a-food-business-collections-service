"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        "registrations",
        "unified_view_collected",
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        "registrations",
        "unified_view_collected_at",
        Sequelize.STRING
      )
    ]);
  },
  down: queryInterface => {
    return Promise.all([
      queryInterface.removeColumn("registrations", "unified_view_collected"),
      queryInterface.removeColumn("registrations", "unified_view_collected_at")
    ]);
  }
};
