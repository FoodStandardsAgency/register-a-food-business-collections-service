"use strict";
module.exports = {
  up: (queryInterface) => {
    return Promise.all([
      queryInterface.renameColumn(
        "operators",
        "operator_company_house_number",
        "operator_companies_house_number"
      ),
    ]);
  },
  down: (queryInterface) => {
    return Promise.all([
      queryInterface.renameColumn(
        "operators",
        "operator_companies_house_number",
        "operator_company_house_number"
      ),
    ]);
  },
};
