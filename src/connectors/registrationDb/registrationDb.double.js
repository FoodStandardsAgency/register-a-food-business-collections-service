const doubleResponse = [
  {
    id: 69,
    fsa_rn: "PQQK8Q-SN9N8C-4ADETF",
    council: "west-dorset",
    createdAt: "2018-10-30T14:51:47.303Z",
    updatedAt: "2018-10-30T14:51:47.303Z",
    collected: false,
    collectedAt: "2018-10-30T14:51:47.303Z",
    establishment: {
      id: 68,
      establishment_trading_name: "Itsu",
      establishment_opening_date: "2018-06-07",
      establishment_primary_number: "329857245",
      establishment_secondary_number: "84345245",
      establishment_email: "django@email.com",
      establishment_web_address: "test.com",
      createdAt: "2018-10-30T14:51:47.321Z",
      updatedAt: "2018-10-30T14:51:47.321Z",
      registrationId: 69,
      operator: {
        id: 68,
        operator_type: "Sole trader",
        operator_company_name: "name",
        operator_company_house_number: null,
        operator_charity_name: null,
        operator_charity_number: null,
        operator_first_name: "Fred",
        operator_last_name: "Bloggs",
        operator_address_line_1: "12",
        operator_address_line_2: "Pie Lane",
        operator_address_line_3: "Test",
        operator_postcode: "SW12 9RQ",
        operator_street: "Some St.",
        operator_town: "London",
        operator_primary_number: "9827235",
        operator_secondary_number: null,
        operator_email: "operator@email.com",
        contact_representative_name: null,
        contact_representative_role: null,
        contact_representative_number: null,
        contact_representative_email: null,
        createdAt: "2018-10-30T14:51:47.327Z",
        updatedAt: "2018-10-30T14:51:47.327Z",
        establishmentId: 68
      },
      activities: {
        id: 62,
        customer_type: "End consumer",
        business_type: "Livestock farm",
        business_type_search_term: null,
        import_export_activities: "None",
        water_supply: "Public",
        business_other_details: null,
        opening_days_irregular: null,
        opening_day_monday: true,
        opening_day_tuesday: true,
        opening_day_wednesday: true,
        opening_day_thursday: true,
        opening_day_friday: true,
        opening_day_saturday: true,
        opening_day_sunday: true,
        opening_hours_monday: "9:30 - 19:00",
        opening_hours_tuesday: "09:30 - 19:00",
        opening_hours_wednesday: "9:30am - 7pm",
        opening_hours_thursday: "0930 - 1900",
        opening_hours_friday: "9:30 to 19:00",
        opening_hours_saturday: "09:30 to 19:00",
        opening_hours_sunday: "From 9:30 to 19:00",
        createdAt: "2018-10-30T14:51:47.332Z",
        updatedAt: "2018-10-30T14:51:47.332Z",
        establishmentId: 68
      },
      premise: {
        id: 62,
        establishment_address_line_1: "12",
        establishment_address_line_2: "Street",
        establishment_address_line_3: "Test",
        establishment_town: "London",
        establishment_postcode: "SW12 9RQ",
        establishment_type: "Place",
        createdAt: "2018-10-30T14:51:47.339Z",
        updatedAt: "2018-10-30T14:51:47.339Z",
        establishmentId: 68
      }
    },
    metadata: {
      id: 62,
      declaration1: "Declaration",
      declaration2: "Declaration",
      declaration3: "Declaration",
      createdAt: "2018-10-30T14:51:47.352Z",
      updatedAt: "2018-10-30T14:51:47.352Z",
      registrationId: 69
    }
  }
];

const updateResponse = { fsa_rn: "1234", collected: true };

const registrationDbDouble = (double_mode) => {
  if (double_mode === "success") {
    return doubleResponse;
  } else if (double_mode === "fail") {
    throw new Error("Registration DB double, double mode is set to 'fail'");
  } else if (double_mode === "update") {
    return updateResponse;
  } else if (double_mode === "single") {
    return doubleResponse[0];
  } else {
    throw new Error(
      "Registration DB double, double mode is undefined or not supported"
    );
  }
};

module.exports = { registrationDbDouble };
