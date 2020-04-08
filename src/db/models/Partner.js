module.exports = (sequelize, DataTypes) => {
  const Partner = sequelize.define(
    "partner",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      partner_name: { type: DataTypes.STRING },
      partner_is_primary_contact: { type: DataTypes.BOOLEAN },
    },
    {
      timestamps: false,
    }
  );
  Partner.associate = function (models) {
    Partner.belongsTo(models.operator);
  };
  return Partner;
};
