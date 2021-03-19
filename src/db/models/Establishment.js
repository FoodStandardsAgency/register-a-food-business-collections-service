module.exports = (sequelize, DataTypes) => {
  const Establishment = sequelize.define(
    "establishment",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      establishment_trading_name: { type: DataTypes.STRING },
      establishment_opening_date: { type: DataTypes.STRING },
      establishment_primary_number: { type: DataTypes.STRING },
      establishment_secondary_number: { type: DataTypes.STRING },
      establishment_email: { type: DataTypes.STRING },
      establishment_web_address: { type: DataTypes.STRING }
    },
    {
      timestamps: false,
      schema: "registrations"
    }
  );
  Establishment.associate = function (models) {
    Establishment.belongsTo(models.registration);
  };
  return Establishment;
};
