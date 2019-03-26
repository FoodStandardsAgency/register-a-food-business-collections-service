module.exports = (sequelize, DataTypes) => {
  const Operator = sequelize.define(
    "operator",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      operator_type: { type: DataTypes.STRING },
      operator_company_name: { type: DataTypes.STRING },
      operator_company_house_number: { type: DataTypes.STRING },
      operator_charity_name: { type: DataTypes.STRING },
      operator_charity_number: { type: DataTypes.STRING },
      operator_first_name: { type: DataTypes.STRING },
      operator_last_name: { type: DataTypes.STRING },
      operator_postcode: { type: DataTypes.STRING },
      operator_uprn: { type: DataTypes.STRING },
      operator_first_line: { type: DataTypes.STRING },
      operator_street: { type: DataTypes.STRING },
      operator_town: { type: DataTypes.STRING },
      operator_primary_number: { type: DataTypes.STRING },
      operator_secondary_number: { type: DataTypes.STRING },
      operator_email: { type: DataTypes.STRING },
      contact_representative_name: { type: DataTypes.STRING },
      contact_representative_role: { type: DataTypes.STRING },
      contact_representative_number: { type: DataTypes.STRING },
      contact_representative_email: { type: DataTypes.STRING }
    },
    {}
  );
  Operator.associate = function(models) {
    Operator.belongsTo(models.establishment);
    Operator.hasMany(models.partner);
  };
  return Operator;
};
