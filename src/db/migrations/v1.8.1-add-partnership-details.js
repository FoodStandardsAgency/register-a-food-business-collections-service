"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("partners", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      },
      partner_name: {
        type: Sequelize.STRING
      },
      partner_is_primary_contact: {
        type: Sequelize.BOOLEAN
      },
      operatorId: {
        type: Sequelize.INTEGER,
        references: {
          model: "operators",
          key: "id"
        },
        onUpdate: "cascade",
        onDelete: "cascade"
      }
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable("partners");
  }
};