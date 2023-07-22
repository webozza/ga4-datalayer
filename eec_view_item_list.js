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
    if (string.startsWith("?")) {
      string = string.substring(1);
    }

    const pairs = string.split("&");
    const obj = {};

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

    str = str.slice(0, -3);

    return str;
  };

  let curLoc = window.location.href;
  let filters;
  let formattedFilters;

  if (curLoc.indexOf("?dezela") > -1) {
    filters = convertStringToObject(window.location.search);
    formattedFilters = convertObjectToString(filters);
    console.log(formattedFilters);
  }

  let newProductListing = [];
  let pushedItems = {}; // Lookup object to store the items that have already been pushed

  let pushProductToList = (entries, item_list_name, index) => {
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
      item_list_name: item_list_name,
      index: index,
    });
  };

  if (curLoc.indexOf("?dezela") > -1) {
    let filteredDepartureIds = [];

    $(".cr_row_active_all, .cr_row_active").each(function () {
      let departured_id = $(this).data("id");
      filteredDepartureIds.push(departured_id);
    });

    if ($("body").hasClass("single-potovanja")) {
      oskarDepartures2.map((entries, index) => {
        if (
          isCountryTemplate > 0 &&
          idsUnderCountry.includes(parseInt(entries.ID))
        ) {
          if (filteredDepartureIds.includes(parseInt(entries.ID))) {
            if (!pushedItems[entries.ID]) {
              pushProductToList(
                entries,
                `Departures Table | ${formattedFilters}`,
                index + 1
              );
              pushedItems[entries.ID] = true;
            }
          }
        } else {
          if (filteredDepartureIds.includes(parseInt(entries.ID))) {
            if (!pushedItems[entries.ID]) {
              pushProductToList(entries, "Departures Table", index + 1);
              pushedItems[entries.ID] = true;
            }
          }
        }
      });
    } else {
      oskarDepartures.map((entries, index) => {
        if (
          isCountryTemplate > 0 &&
          idsUnderCountry.includes(parseInt(entries.ID))
        ) {
          if (filteredDepartureIds.includes(parseInt(entries.ID))) {
            if (!pushedItems[entries.ID]) {
              pushProductToList(
                entries,
                `Departures Table | ${formattedFilters}`,
                index + 1
              );
              pushedItems[entries.ID] = true;
            }
          }
        } else {
          if (filteredDepartureIds.includes(parseInt(entries.ID))) {
            if (!pushedItems[entries.ID]) {
              pushProductToList(entries, "Departures Table", index + 1);
              pushedItems[entries.ID] = true;
            }
          }
        }
      });
    }
  } else {
    if ($("body").hasClass("single-potovanja")) {
      oskarDepartures2.map((entries, index) => {
        if (
          isCountryTemplate > 0 &&
          idsUnderCountry.includes(parseInt(entries.ID))
        ) {
          if (!pushedItems[entries.ID]) {
            pushProductToList(entries, "Departures Table", index + 1);
            pushedItems[entries.ID] = true;
          }

          $(".grid-overlay--link").each(function () {
            let thisBanner = $(this);
            let bannerId = thisBanner.data("travel-id");
            let bannerIndex = thisBanner.parent().index();
            let bannerFilter = $("#potovanja .filter a.active").text();
            let foundMatchingEntry = false;

            oskarDepartures.map((entries) => {
              if (entries.travel_id == bannerId && !foundMatchingEntry) {
                if (!pushedItems[entries.ID]) {
                  pushProductToList(
                    entries,
                    `${entries.travel_name}: Travel | ${bannerFilter}`,
                    bannerIndex + 1
                  );
                  pushedItems[entries.ID] = true;
                }
                foundMatchingEntry = true;
                return false;
              }
            });
          });
        }
      });
    } else {
      oskarDepartures.map((entries, index) => {
        if (
          isCountryTemplate > 0 &&
          idsUnderCountry.includes(parseInt(entries.ID))
        ) {
          if (!pushedItems[entries.ID]) {
            pushProductToList(entries, "Departures Table", index + 1);
            pushedItems[entries.ID] = true;
          }

          $(".grid-overlay--link").each(function () {
            let thisBanner = $(this);
            let bannerId = thisBanner.data("travel-id");
            let bannerIndex = thisBanner.parent().index();
            let bannerFilter = $("#potovanja .filter a.active").text();
            let foundMatchingEntry = false;

            oskarDepartures.map((entries) => {
              if (entries.travel_id == bannerId && !foundMatchingEntry) {
                if (!pushedItems[entries.ID]) {
                  pushProductToList(
                    entries,
                    `${entries.travel_name}: Travel | ${bannerFilter}`,
                    bannerIndex + 1
                  );
                  pushedItems[entries.ID] = true;
                }
                foundMatchingEntry = true;
                return false;
              }
            });
          });
        }
      });
    }
  }

  window.dataLayer.push({ event_params: null, ecommerce: null });
  window.dataLayer.push({
    event: "RO_event_EEC",
    event_params: {
      gtm_name: "EEC_view_item_list",
    },
    ecommerce: {
      currency: "EUR",
      items: newProductListing,
    },
  });

  if (pageHasList > 0) {
    productListView();
  }
});
