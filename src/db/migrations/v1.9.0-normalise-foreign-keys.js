"use strict";

const dropEstablishmentsForeignKey = (queryInterface, t) =>
  queryInterface.removeConstraint(
    "establishments",
    "establishments_registrationId_fkey",
    { transaction: t }
  );

const recreateEstablishmentsForeignKey = (queryInterface, t, setting) =>
  queryInterface.addConstraint("establishments", ["registrationId"], {
    type: "foreign key",
    name: "establishments_registrationId_fkey",
    references: {
      table: "registrations",
      field: "id",
    },
    onUpdate: "cascade",
    onDelete: setting,
    transaction: t,
  });

const dropMetadataForeignKey = (queryInterface, t) =>
  queryInterface.removeConstraint("metadata", "metadata_registrationId_fkey", {
    transaction: t,
  });

const recreateMetadataForeignKey = (queryInterface, t, setting) =>
  queryInterface.addConstraint("metadata", ["registrationId"], {
    type: "foreign key",
    name: "metadata_registrationId_fkey",
    references: {
      table: "registrations",
      field: "id",
    },
    onUpdate: "cascade",
    onDelete: setting,
    transaction: t,
  });

const dropOperatorsForeignKey = (queryInterface, t) =>
  queryInterface.removeConstraint(
    "operators",
    "operators_establishmentId_fkey",
    { transaction: t }
  );

const recreateOperatorsForeignKey = (queryInterface, t, setting) =>
  queryInterface.addConstraint("operators", ["establishmentId"], {
    type: "foreign key",
    name: "operators_establishmentId_fkey",
    references: {
      table: "establishments",
      field: "id",
    },
    onUpdate: "cascade",
    onDelete: setting,
    transaction: t,
  });

const dropPremisesForeignKey = (queryInterface, t) =>
  queryInterface.removeConstraint("premises", "premises_establishmentId_fkey", {
    transaction: t,
  });

const recreatePremisesForeignKey = (queryInterface, t, setting) =>
  queryInterface.addConstraint("premises", ["establishmentId"], {
    type: "foreign key",
    name: "premises_establishmentId_fkey",
    references: {
      table: "establishments",
      field: "id",
    },
    onUpdate: "cascade",
    onDelete: setting,
    transaction: t,
  });

const dropActivitiesForeignKey = (queryInterface, t) =>
  queryInterface.removeConstraint(
    "activities",
    "activities_establishmentId_fkey",
    { transaction: t }
  );

const recreateActivitiesForeignKey = (queryInterface, t, setting) =>
  queryInterface.addConstraint("activities", ["establishmentId"], {
    type: "foreign key",
    name: "activities_establishmentId_fkey",
    references: {
      table: "establishments",
      field: "id",
    },
    onUpdate: "cascade",
    onDelete: setting,
    transaction: t,
  });

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        dropEstablishmentsForeignKey(queryInterface, t).then(() =>
          recreateEstablishmentsForeignKey(queryInterface, t, "cascade")
        ),
        dropMetadataForeignKey(queryInterface, t).then(() =>
          recreateMetadataForeignKey(queryInterface, t, "cascade")
        ),
        dropOperatorsForeignKey(queryInterface, t).then(() =>
          recreateOperatorsForeignKey(queryInterface, t, "cascade")
        ),
        dropPremisesForeignKey(queryInterface, t).then(() =>
          recreatePremisesForeignKey(queryInterface, t, "cascade")
        ),
        dropActivitiesForeignKey(queryInterface, t).then(() =>
          recreateActivitiesForeignKey(queryInterface, t, "cascade")
        ),
      ]);
    });
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        dropEstablishmentsForeignKey(queryInterface, t).then(() =>
          recreateEstablishmentsForeignKey(queryInterface, t, "set null")
        ),
        dropMetadataForeignKey(queryInterface, t).then(() =>
          recreateMetadataForeignKey(queryInterface, t, "set null")
        ),
        dropOperatorsForeignKey(queryInterface, t).then(() =>
          recreateOperatorsForeignKey(queryInterface, t, "set null")
        ),
        dropPremisesForeignKey(queryInterface, t).then(() =>
          recreatePremisesForeignKey(queryInterface, t, "set null")
        ),
        dropActivitiesForeignKey(queryInterface, t).then(() =>
          recreateActivitiesForeignKey(queryInterface, t, "set null")
        ),
      ]);
    });
  },
};
