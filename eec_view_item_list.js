jQuery(document).ready(function ($) {
  var pageHasList = $(".table--departures").length;
  var isCountryTemplate = $(".cr--listing").length;
  var idsUnderCountry = [];

  if (isCountryTemplate > 0 || $("body").hasClass("single-potovanja")) {
    $(".cr--listing").each(function () {
      let departureIds = $(this).data("id");
      idsUnderCountry.push(departureIds);
    });
  }

  let productListView = () => {
    // PREPARE THE VARIABLES
    let productListing = [];

    if ($("body").hasClass("single-potovanja")) {
      oskarDepartures2.map((entries, index) => {
        if (isCountryTemplate > 0) {
          if (idsUnderCountry.includes(parseInt(entries.ID))) {
            // Convert entries.ID to number for comparison
            let productsByCountry = [];
            productsByCountry.push({
              item_id: entries.product_id,
              item_name: entries.travel_name,
              item_brand: "Agencija Oskar",
              item_category: "Travel",
              item_category2: entries.country_name,
              price: entries.actual_price,
              discount: entries.price - entries.actual_price,
              affiliation: undefined,
              travel_departure_date: entries.departure_start_date,
              travel_style: entries.travel_style,
              travel_type: undefined,
              travel_group_size: entries.velikost_skupine,
              travel_duration: entries.travel_duration,
              travel_guide_id: undefined,
              product_type: "Main",
              travel_age_group: undefined,
              item_list_name: `${entries.travel_name}: Departures Table'`,
              // index: index + 1,
            });
            productsByCountry.map((entries, index) => {
              entries["index"] = index + 1;
            });
            productListing = productsByCountry;
          }
        } else {
          productListing.push({
            item_id: entries.product_id,
            item_name: entries.travel_name,
            item_brand: "Agencija Oskar",
            item_category: "Travel",
            item_category2: entries.country_name,
            price: entries.actual_price,
            discount: entries.price - entries.actual_price,
            affiliation: undefined,
            travel_departure_date: entries.departure_start_date,
            travel_style: entries.travel_style,
            travel_type: undefined,
            travel_group_size: entries.velikost_skupine,
            travel_duration: entries.travel_duration,
            travel_guide_id: undefined,
            product_type: "Main",
            travel_age_group: undefined,
            item_list_name: `${entries.travel_name}: Departures Table'`,
            index: index + 1,
          });
        }
      });
    } else {
      oskarDepartures.map((entries, index) => {
        if (isCountryTemplate > 0) {
          if (idsUnderCountry.includes(parseInt(entries.ID))) {
            // Convert entries.ID to number for comparison
            productListing.push({
              item_id: entries.product_id,
              item_name: entries.travel_name,
              item_brand: "Agencija Oskar",
              item_category: "Travel",
              item_category2: entries.country_name,
              price: entries.actual_price,
              discount: entries.price - entries.actual_price,
              affiliation: undefined,
              travel_departure_date: entries.departure_start_date,
              travel_style: entries.travel_style,
              travel_type: undefined,
              travel_group_size: entries.velikost_skupine,
              travel_duration: entries.travel_duration,
              travel_guide_id: undefined,
              product_type: "Main",
              travel_age_group: undefined,
              item_list_name: `${entries.travel_name}: Departures Table'`,
              index: index + 1,
            });
          }
        } else {
          productListing.push({
            item_id: entries.product_id,
            item_name: entries.travel_name,
            item_brand: "Agencija Oskar",
            item_category: "Travel",
            item_category2: entries.country_name,
            price: entries.actual_price,
            discount: entries.price - entries.actual_price,
            affiliation: undefined,
            travel_departure_date: entries.departure_start_date,
            travel_style: entries.travel_style,
            travel_type: undefined,
            travel_group_size: entries.velikost_skupine,
            travel_duration: entries.travel_duration,
            travel_guide_id: undefined,
            product_type: "Main",
            travel_age_group: undefined,
            item_list_name: `${entries.travel_name}: Departures Table'`,
            index: index + 1,
          });
        }
      });
    }

    // PUSH TO GA4
    window.dataLayer.push({ event_params: null, ecommerce: null });
    window.dataLayer.push({
      event: "RO_event_EEC",
      event_params: {
        gtm_name: "EEC_view_item_list",
      },
      ecommerce: {
        currency: "EUR",
        items: productListing,
      },
    });
  };

  if (pageHasList > 0) {
    productListView();
  }
});
