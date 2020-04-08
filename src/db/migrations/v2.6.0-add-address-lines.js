"use strict";
const addNewColumns = async (queryInterface, Sequelize, transaction) => {
  return (
    Promise.all([
      queryInterface.addColumn(
        "operators",
        "operator_address_line_1",
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        "operators",
        "operator_address_line_2",
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        "operators",
        "operator_address_line_3",
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        "premises",
        "establishment_address_line_1",
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        "premises",
        "establishment_address_line_2",
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        "premises",
        "establishment_address_line_3",
        Sequelize.STRING
      ),
    ]),
    { transaction: transaction }
  );
};

const copyData = async (queryInterface, transaction) => {
  return Promise.all([
    await queryInterface.sequelize.query(
      "UPDATE operators SET operator_address_line_1 = operator_first_line",
      "UPDATE operators SET operator_address_line_2 = operator_street",
      "UPDATE operators SET operator_address_line_3 = operator_dependent_locality",
      "UPDATE premises SET establishment_address_line_1 = establishment_first_line",
      "UPDATE premises SET establishment_address_line_2 = establishment_street",
      "UPDATE premises SET establishment_address_line_3 = establishment_dependent_locality",
      { transaction: transaction }
    ),
  ]);
};

const removeOldColumns = async (queryInterface, transaction) => {
  return (
    queryInterface.removeColumn("operators", "operator_first_line"),
    queryInterface.removeColumn("operators", "operator_street"),
    queryInterface.removeColumn("operators", "operator_dependent_locality"),
    queryInterface.removeColumn("premises", "establishment_first_line"),
    queryInterface.removeColumn("premises", "establishment_street"),
    queryInterface.removeColumn("premises", "establishment_dependent_locality"),
    { transaction: transaction }
  );
};

const removeNewColumns = async (queryInterface, transaction) => {
  return (
    Promise.all([
      queryInterface.removeColumn("operators", "operator_address_line_1"),
      queryInterface.removeColumn("operators", "operator_address_line_2"),
      queryInterface.removeColumn("operators", "operator_address_line_3"),
      queryInterface.removeColumn("premises", "establishment_address_line_1"),
      queryInterface.removeColumn("premises", "establishment_address_line_2"),
      queryInterface.removeColumn("premises", "establishment_address_line_3"),
    ]),
    { transaction: transaction }
  );
};

const recopyData = async (queryInterface, transaction) => {
  return Promise.all([
    await queryInterface.sequelize.query(
      "UPDATE operators SET operator_first_line = operator_address_line_1",
      "UPDATE operators SET operator_street = operator_address_line_2",
      "UPDATE operators SET operator_dependent_locality = operator_address_line_3",
      "UPDATE premises SET establishment_first_line = establishment_address_line_1",
      "UPDATE premises SET establishment_street = establishment_address_line_2",
      "UPDATE premises SET establishment_dependent_locality = establishment_address_line_3",
      { transaction: transaction }
    ),
  ]);
};
const addOldColumns = async (queryInterface, Sequelize, transaction) => {
  return (
    Promise.all([
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
      queryInterface.addColumn(
        "operators",
        "operator_dependent_locality",
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
        "establishment_dependent_locality",
        Sequelize.STRING
      ),
    ]),
    { transaction: transaction }
  );
};

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await addNewColumns(queryInterface, Sequelize, transaction);
      await copyData(queryInterface, transaction);
      return removeOldColumns(queryInterface, transaction);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await addOldColumns(queryInterface, Sequelize, transaction);
      await recopyData(queryInterface, transaction);
      return removeNewColumns(queryInterface, transaction);
    });
  },
};
