module.exports = (sequelize, DataTypes) => {
  const Premise = sequelize.define(
    "premise",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      establishment_first_line: { type: DataTypes.STRING },
      establishment_street: { type: DataTypes.STRING },
      establishment_town: { type: DataTypes.STRING },
      establishment_postcode: { type: DataTypes.STRING },
      establishment_uprn: { type: DataTypes.STRING },
      establishment_type: { type: DataTypes.STRING }
    },
    {}
  );
  Premise.associate = function(models) {
    Premise.belongsTo(models.establishment);
  };
  return Premise;
};
