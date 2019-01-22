"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        "establishments",
        "establishment_primary_number",
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        "establishments",
        "establishment_secondary_number",
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        "establishments",
        "establishment_email",
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        "operators",
        "operator_company_name",
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        "operators",
        "operator_charity_name",
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        "operators",
        "operator_first_name",
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        "operators",
        "operator_last_name",
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        "operators",
        "operator_postcode",
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        "operators",
        "operator_first_line",
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        "operators",
        "operator_street",
        Sequelize.STRING
      ),
      queryInterface.addColumn("operators", "operator_town", Sequelize.STRING),
      queryInterface.addColumn(
        "operators",
        "operator_primary_number",
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        "operators",
        "operator_secondary_number",
        Sequelize.STRING
      ),
      queryInterface.addColumn("operators", "operator_email", Sequelize.STRING),
      queryInterface.addColumn(
        "operators",
        "contact_representative_name",
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        "operators",
        "contact_representative_role",
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        "operators",
        "contact_representative_number",
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        "operators",
        "contact_representative_email",
        Sequelize.STRING
      )
    ]);
  },
  down: queryInterface => {
    return Promise.all([
      queryInterface.removeColumn(
        "establishments",
        "establishment_primary_number"
      ),
      queryInterface.removeColumn(
        "establishments",
        "establishment_secondary_number"
      ),
      queryInterface.removeColumn("establishments", "establishment_email"),
      queryInterface.removeColumn("operators", "operator_company_name"),
      queryInterface.removeColumn("operators", "operator_charity_name"),
      queryInterface.removeColumn("operators", "operator_first_name"),
      queryInterface.removeColumn("operators", "operator_last_name"),
      queryInterface.removeColumn("operators", "operator_postcode"),
      queryInterface.removeColumn("operators", "operator_first_line"),
      queryInterface.removeColumn("operators", "operator_street"),
      queryInterface.removeColumn("operators", "operator_town"),
      queryInterface.removeColumn("operators", "operator_primary_number"),
      queryInterface.removeColumn("operators", "operator_secondary_number"),
      queryInterface.removeColumn("operators", "operator_email"),
      queryInterface.removeColumn("operators", "contact_representative_name"),
      queryInterface.removeColumn("operators", "contact_representative_role"),
      queryInterface.removeColumn("operators", "contact_representative_number"),
      queryInterface.removeColumn("operators", "contact_representative_email")
    ]);
  }
};
