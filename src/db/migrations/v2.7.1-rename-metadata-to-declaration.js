"use strict";
module.exports = {
  up: (queryInterface) => {
    return Promise.all([
      queryInterface.renameTable("metadata", "declarations"),
    ]);
  },
  down: (queryInterface) => {
    return Promise.all([
      queryInterface.renameTable("declarations", "metadata"),
    ]);
  },
};
