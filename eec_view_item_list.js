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

  let convertStringToObject = (string) => {
    // Remove the leading '?' character if present
    if (string.startsWith("?")) {
      string = string.substring(1);
    }

    // Split the string into key-value pairs
    const pairs = string.split("&");

    // Create an empty object to store the key-value pairs
    const obj = {};

    // Iterate over the pairs and populate the object
    pairs.forEach((pair) => {
      const [key, value] = pair.split("=");
      const decodedKey = decodeURIComponent(key);
      const decodedValue = decodeURIComponent(value);

      if (obj.hasOwnProperty(decodedKey)) {
        obj[decodedKey].push(decodedValue);
      } else {
        obj[decodedKey] = [decodedValue];
      }
    });

    return obj;
  };

  let convertObjectToString = (obj) => {
    let str = "";

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const values = obj[key];
        const decodedKey = decodeURIComponent(key.replace("[]", ""));
        const decodedValue = decodeURIComponent(values[0]);

        str += `${decodedKey}: ${decodedValue} | `;
      }
    }

    // Remove the trailing " | " from the string
    str = str.slice(0, -3);

    return str;
  };

  let curLoc = window.location.href;
  let filters;
  let formattedFilters;

  if (curLoc.indexOf("?") > -1) {
    filters = convertStringToObject(window.location.search);
    formattedFilters = convertObjectToString(filters);
    console.log(formattedFilters);
  }

  let banners = [];
  let bannersList = () => {
    $(".grid-overlay--link").each(function () {
      let thisBanner = $(this);
      let bannerId = thisBanner.data("travel-id");
      let bannerIndex = thisBanner.parent().index();
      let bannerFilter = $("#potovanja .filter a.active")
        .text()
        .replace(/\n\s+/g, " ");
      let foundMatchingEntry = false;

      if ($("body").hasClass("single-potovanja")) {
        oskarDepartures2.map((entries) => {
          if (entries.travel_id == bannerId && !foundMatchingEntry) {
            banners.push({
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
              item_list_name: `${entries.travel_name}: Travel | ${bannerFilter}`,
              index: bannerIndex + 1,
            });
            foundMatchingEntry = true;
          }
        });
      } else {
        oskarDepartures.map((entries) => {
          if (entries.travel_id == bannerId && !foundMatchingEntry) {
            banners.push({
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
              item_list_name: `${entries.travel_name}: Travel | ${bannerFilter}`,
              index: bannerIndex + 1,
            });
            foundMatchingEntry = true;
          }
        });
      }
    });
  };

  let productListView = () => {
    // PREPARE THE VARIABLES
    let productListing = [];
    let newProductListing = [];

    if (curLoc.indexOf("?") > -1) {
      let filteredDepartureIds = [];

      $(".cr_row_active_all, .cr_row_active").each(function () {
        let departured_id = $(this).data("id");
        filteredDepartureIds.push(departured_id);
      });

      if ($("body").hasClass("single-potovanja")) {
        oskarDepartures2.map((entries, index) => {
          if (isCountryTemplate > 0) {
            if (idsUnderCountry.includes(parseInt(entries.ID))) {
              // Convert entries.ID to number for comparison

              if (filteredDepartureIds.includes(parseInt(entries.ID))) {
                newProductListing.push({
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
                  item_list_name: `Departures Table | ${formattedFilters}`,
                  //index: index + 1,
                });
              }
            }
          } else {
            if (filteredDepartureIds.includes(parseInt(entries.ID))) {
              newProductListing.push({
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
                item_list_name: `Departures Table | ${formattedFilters}`,
                //index: index + 1,
              });
            }
          }
        });
      } else {
        oskarDepartures.map((entries, index) => {
          if (isCountryTemplate > 0) {
            if (idsUnderCountry.includes(parseInt(entries.ID))) {
              // Convert entries.ID to number for comparison
              if (filteredDepartureIds.includes(parseInt(entries.ID))) {
                newProductListing.push({
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
                  item_list_name: `Departures Table | ${formattedFilters}`,
                  //index: index + 1,
                });
              }
            }
          } else {
            if (filteredDepartureIds.includes(parseInt(entries.ID))) {
              newProductListing.push({
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
                item_list_name: `Departures Table | ${formattedFilters}`,
                //index: index + 1,
              });
            }
          }
        });
      }
      newProductListing.map((entries, index) => {
        entries["index"] = index + 1;
      });
    } else {
      if ($("body").hasClass("single-potovanja")) {
        oskarDepartures2.map((entries, index) => {
          if (isCountryTemplate > 0) {
            if (idsUnderCountry.includes(parseInt(entries.ID))) {
              // Convert entries.ID to number for comparison

              newProductListing.push({
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
                item_list_name: `${entries.travel_name}: Departures Table`,
                //index: index + 1,
              });
            }
          } else {
            newProductListing.push({
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
              item_list_name: `${entries.travel_name}: Departures Table`,
              //index: index + 1,
            });
          }
        });
      } else {
        oskarDepartures.map((entries, index) => {
          if (isCountryTemplate > 0) {
            if (idsUnderCountry.includes(parseInt(entries.ID))) {
              // Convert entries.ID to number for comparison
              newProductListing.push({
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
                item_list_name: `${item_category2}: Departures Table`,
                //index: index + 1,
              });
            }
          } else {
            newProductListing.push({
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
              item_list_name: "Departures Table",
              //index: index + 1,
            });
          }
        });
      }
      newProductListing.map((entries, index) => {
        entries["index"] = index + 1;
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
        items: [...banners, ...newProductListing],
      },
    });
  };

  if (pageHasList > 0) {
    bannersList();
    productListView();
  }
});
