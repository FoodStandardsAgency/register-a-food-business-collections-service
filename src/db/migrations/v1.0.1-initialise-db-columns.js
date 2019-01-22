"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("activities", "customer_type", Sequelize.STRING),
      queryInterface.addColumn("activities", "business_type", Sequelize.STRING),
      queryInterface.addColumn(
        "activities",
        "business_type_search_term",
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        "activities",
        "import_export_activities",
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        "establishments",
        "establishment_trading_name",
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        "establishments",
        "establishment_opening_date",
        Sequelize.STRING
      ),
      queryInterface.addColumn("metadata", "declaration1", Sequelize.STRING),
      queryInterface.addColumn("metadata", "declaration2", Sequelize.STRING),
      queryInterface.addColumn("metadata", "declaration3", Sequelize.STRING),
      queryInterface.addColumn("operators", "operator_type", Sequelize.STRING),
      queryInterface.addColumn(
        "operators",
        "operator_company_house_number",
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        "operators",
        "operator_charity_number",
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        "premises",
        "establishment_first_line",
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        "premises",
        "establishment_street",
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        "premises",
        "establishment_town",
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        "premises",
        "establishment_postcode",
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        "premises",
        "establishment_type",
        Sequelize.STRING
      ),
      queryInterface.addColumn("registrations", "fsa_rn", Sequelize.STRING)
    ]);
  },
  down: queryInterface => {
    return Promise.all([
      queryInterface.removeColumn("activities", "customer_type"),
      queryInterface.removeColumn("activities", "business_type"),
      queryInterface.removeColumn("activities", "business_type_search_term"),
      queryInterface.removeColumn("activities", "import_export_activities"),
      queryInterface.removeColumn(
        "establishments",
        "establishment_trading_name"
      ),
      queryInterface.removeColumn(
        "establishments",
        "establishment_opening_date"
      ),
      queryInterface.removeColumn("metadata", "declaration1"),
      queryInterface.removeColumn("metadata", "declaration2"),
      queryInterface.removeColumn("metadata", "declaration3"),
      queryInterface.removeColumn("operators", "operator_type"),
      queryInterface.removeColumn("operators", "operator_company_house_number"),
      queryInterface.removeColumn("operators", "operator_charity_number"),
      queryInterface.removeColumn("premises", "establishment_first_line"),
      queryInterface.removeColumn("premises", "establishment_street"),
      queryInterface.removeColumn("premises", "establishment_town"),
      queryInterface.removeColumn("premises", "establishment_postcode"),
      queryInterface.removeColumn("premises", "establishment_type")
    ]);
  }
};
