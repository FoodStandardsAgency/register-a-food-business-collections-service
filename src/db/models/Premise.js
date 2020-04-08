module.exports = (sequelize, DataTypes) => {
  const Premise = sequelize.define(
    "premise",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      establishment_address_line_1: { type: DataTypes.STRING },
      establishment_address_line_2: { type: DataTypes.STRING },
      establishment_address_line_3: { type: DataTypes.STRING },
      establishment_town: { type: DataTypes.STRING },
      establishment_postcode: { type: DataTypes.STRING },
      establishment_uprn: { type: DataTypes.STRING },
      establishment_type: { type: DataTypes.STRING },
    },
    {
      timestamps: false,
    }
  );
  Premise.associate = function (models) {
    Premise.belongsTo(models.establishment);
  };
  return Premise;
};
