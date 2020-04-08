"use strict";

const { populateCouncils } = require("../../../scripts/populate-council-table");

const createCouncil = async (queryInterface, Sequelize) => {
  queryInterface.createTable("councils", {
    createdAt: {
      type: Sequelize.DATE,
    },
    updatedAt: {
      type: Sequelize.DATE,
    },
    local_council_url: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    local_council_full_name: {
      type: Sequelize.STRING,
    },
    competent_authority_id: {
      type: Sequelize.INTEGER,
    },
  });
};

const createCouncilsForeignKey = async (queryInterface, transaction) => {
  return queryInterface.addConstraint("registrations", ["council"], {
    type: "foreign key",
    name: "registrations_council_fkey",
    references: {
      table: "councils",
      field: "local_council_url",
    },
    onUpdate: "cascade",
    onDelete: "cascade",
    transaction: transaction,
  });
};

const dropCouncilsForeignKey = async (queryInterface, transaction) => {
  return queryInterface.removeConstraint(
    "registrations",
    "registrations_council_fkey",
    { transaction: transaction }
  );
};

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await createCouncil(queryInterface, Sequelize);
      await populateCouncils(transaction);
      return createCouncilsForeignKey(queryInterface, transaction);
    });
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await dropCouncilsForeignKey(queryInterface, transaction);
      return queryInterface.dropTable("councils", { transaction: transaction });
    });
  },
};
