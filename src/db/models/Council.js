module.exports = (sequelize, DataTypes) => {
  const Council = sequelize.define(
    "council",
    {
      local_council_url: { type: DataTypes.STRING, primaryKey: true },
      local_council_full_name: { type: DataTypes.STRING },
      competent_authority_id: { type: DataTypes.INTEGER },
    },
    {}
  );
  return Council;
};
