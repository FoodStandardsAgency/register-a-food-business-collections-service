"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        "activities",
        "opening_days_irregular",
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        "activities",
        "opening_day_monday",
        Sequelize.BOOLEAN
      ),
      queryInterface.addColumn(
        "activities",
        "opening_day_tuesday",
        Sequelize.BOOLEAN
      ),
      queryInterface.addColumn(
        "activities",
        "opening_day_wednesday",
        Sequelize.BOOLEAN
      ),
      queryInterface.addColumn(
        "activities",
        "opening_day_thursday",
        Sequelize.BOOLEAN
      ),
      queryInterface.addColumn(
        "activities",
        "opening_day_friday",
        Sequelize.BOOLEAN
      ),
      queryInterface.addColumn(
        "activities",
        "opening_day_saturday",
        Sequelize.BOOLEAN
      ),
      queryInterface.addColumn(
        "activities",
        "opening_day_sunday",
        Sequelize.BOOLEAN
      ),
    ]);
  },
  down: (queryInterface) => {
    return Promise.all([
      queryInterface.removeColumn("activities", "opening_days_irregular"),
      queryInterface.removeColumn("activities", "opening_day_monday"),
      queryInterface.removeColumn("activities", "opening_day_tuesday"),
      queryInterface.removeColumn("activities", "opening_day_wednesday"),
      queryInterface.removeColumn("activities", "opening_day_thursday"),
      queryInterface.removeColumn("activities", "opening_day_friday"),
      queryInterface.removeColumn("activities", "opening_day_saturday"),
      queryInterface.removeColumn("activities", "opening_day_sunday"),
    ]);
  },
};
