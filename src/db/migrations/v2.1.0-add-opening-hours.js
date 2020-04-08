"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        "activities",
        "opening_hours_monday",
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        "activities",
        "opening_hours_tuesday",
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        "activities",
        "opening_hours_wednesday",
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        "activities",
        "opening_hours_thursday",
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        "activities",
        "opening_hours_friday",
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        "activities",
        "opening_hours_saturday",
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        "activities",
        "opening_hours_sunday",
        Sequelize.STRING
      ),
    ]);
  },
  down: (queryInterface) => {
    return Promise.all([
      queryInterface.removeColumn("activities", "opening_hours_monday"),
      queryInterface.removeColumn("activities", "opening_hours_tuesday"),
      queryInterface.removeColumn("activities", "opening_hours_wednesday"),
      queryInterface.removeColumn("activities", "opening_hours_thursday"),
      queryInterface.removeColumn("activities", "opening_hours_friday"),
      queryInterface.removeColumn("activities", "opening_hours_saturday"),
      queryInterface.removeColumn("activities", "opening_hours_sunday"),
    ]);
  },
};
