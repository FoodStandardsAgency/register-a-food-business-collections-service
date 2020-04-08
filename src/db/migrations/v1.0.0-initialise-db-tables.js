"use strict";

const createRegistrations = (queryInterface, Sequelize) =>
  queryInterface.createTable("registrations", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: {
      type: Sequelize.DATE,
    },
    updatedAt: {
      type: Sequelize.DATE,
    },
  });

const createEstablishments = (queryInterface, Sequelize) =>
  queryInterface.createTable("establishments", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: {
      type: Sequelize.DATE,
    },
    updatedAt: {
      type: Sequelize.DATE,
    },
    registrationId: {
      type: Sequelize.INTEGER,
      references: {
        model: "registrations",
        key: "id",
      },
      onUpdate: "cascade",
      onDelete: "cascade",
    },
  });

const createMetadata = (queryInterface, Sequelize) =>
  queryInterface.createTable("metadata", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: {
      type: Sequelize.DATE,
    },
    updatedAt: {
      type: Sequelize.DATE,
    },
    registrationId: {
      type: Sequelize.INTEGER,
      references: {
        model: "registrations",
        key: "id",
      },
      onUpdate: "cascade",
      onDelete: "cascade",
    },
  });

const createActivities = (queryInterface, Sequelize) =>
  queryInterface.createTable("activities", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: {
      type: Sequelize.DATE,
    },
    updatedAt: {
      type: Sequelize.DATE,
    },
    establishmentId: {
      type: Sequelize.INTEGER,
      references: {
        model: "establishments",
        key: "id",
      },
      onUpdate: "cascade",
      onDelete: "cascade",
    },
  });

const createOperators = (queryInterface, Sequelize) =>
  queryInterface.createTable("operators", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: {
      type: Sequelize.DATE,
    },
    updatedAt: {
      type: Sequelize.DATE,
    },
    establishmentId: {
      type: Sequelize.INTEGER,
      references: {
        model: "establishments",
        key: "id",
      },
      onUpdate: "cascade",
      onDelete: "cascade",
    },
  });

const createPremises = (queryInterface, Sequelize) =>
  queryInterface.createTable("premises", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: {
      type: Sequelize.DATE,
    },
    updatedAt: {
      type: Sequelize.DATE,
    },
    establishmentId: {
      type: Sequelize.INTEGER,
      references: {
        model: "establishments",
        key: "id",
      },
      onUpdate: "cascade",
      onDelete: "cascade",
    },
  });

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      createRegistrations(queryInterface, Sequelize).then(() => {
        createMetadata(queryInterface, Sequelize);
        createEstablishments(queryInterface, Sequelize).then(() => {
          createActivities(queryInterface, Sequelize);
          createOperators(queryInterface, Sequelize);
          createPremises(queryInterface, Sequelize);
        });
      }),
    ]);
  },
  down: (queryInterface) => {
    return Promise.all([
      queryInterface.dropTable("activities"),
      queryInterface.dropTable("establishments"),
      queryInterface.dropTable("metadata"),
      queryInterface.dropTable("operators"),
      queryInterface.dropTable("premises"),
      queryInterface.dropTable("registrations"),
    ]);
  },
};
