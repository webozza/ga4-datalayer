jQuery(document).ready(function ($) {
  var pageHasList = $(".table--departures").length;

  // PREPARE THE VARIABLES
  let selectedItem = async () => {
    let productData = [];

    // Table
    $(".cr_product_link a").click(async function (e) {
      let thisLink = $(this).attr("href");
      e.preventDefault();
      // PREPARE THE VARIABLES
      let getID = $(this).parent().parent().data("id");
      oskarDepartures.map((entries, index) => {
        if (entries.ID == getID) {
          productData.push({
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
            item_list_name: "Status of departures",
            index: index + 1,
          });
        }
      });

      // PUSH TO GA4 ...
      window.dataLayer.push({ event_params: null, ecommerce: null });

      window.dataLayer.push({
        event: "RO_event_EEC",
        event_params: {
          gtm_name: "EEC_select_item",
        },
        ecommerce: {
          currency: "EUR",
          items: productData,
        },
        eventCallback: function () {
          // optional
          document.location = thisLink;
        },
      });
    });

    let hrt = $("#sorodna-potovanja").length == 1;

    // Banner
    $(".grid-overlay--link").click(async function (e) {
      let thisLink = $(this).attr("href");
      e.preventDefault();
      // PREPARE THE VARIABLES
      let getID = $(this).data("travel-id");
      let bannerIndex = $(this).parent().index();
      let bannerFilter = $("#potovanja .filter a.active")
        .text()
        .replace(/\n\s+/g, " ");

      if ($("body").hasClass("single-potovanja")) {
        let currentTripName = $("h1#departure_name").text().trim();

        let hold2 = [];
        oskarDepartures2.map((entries, index) => {
          if (entries.travel_id == getID) {
            let iln;
            if (hrt) {
              iln = `${currentTripName}: Related trips`;
            } else {
              iln = `${currentTripName}: Travel | ${bannerFilter}`;
            }

            hold2.push({
              item_name: entries.travel_name,
              item_brand: "Agencija Oskar",
              item_category: "Travel",
              item_category2: entries.country_name,
              product_type: "Main",
              item_list_name: iln,
              index: bannerIndex + 1,
            });
          }
        });
        productData = [hold2[0]];
      } else {
        let hold = [];
        oskarDepartures.map((entries, index) => {
          if (entries.travel_id == getID) {
            hold.push({
              item_name: entries.travel_name,
              item_brand: "Agencija Oskar",
              item_category: "Travel",
              item_category2: entries.country_name,
              product_type: "Main",
              item_list_name: `${entries.country_name}: Travel | ${bannerFilter}`,
              index: bannerIndex + 1,
            });
          }
        });
        productData = [hold[0]];
      }

      // PUSH TO GA4
      window.dataLayer.push({ event_params: null, ecommerce: null });

      window.dataLayer.push({
        event: "RO_event_EEC",
        event_params: {
          gtm_name: "EEC_select_item",
        },
        ecommerce: {
          currency: "EUR",
          items: productData,
        },
        eventCallback: function () {
          // optional
          document.location = thisLink;
        },
      });
    });
  };

  if (pageHasList > 0) {
    selectedItem();
  }
});
