jQuery(document).ready(function ($) {
  var pageHasList = $(".table--departures").length;

  let purchaseDepartureID;
  let singleItemPrice;

  let addToCart = () => {
    $(".application-form-cta").click(async function () {
      let departureID = $(this).data("departure-id");
      purchaseDepartureID = departureID;
      let travelID = $(this).data("travel-id");
      let addToCartItems = [];

      if ($("body").hasClass("single-potovanja")) {
        oskarDepartures2.map((entries, index) => {
          if (entries.ID == departureID) {
            addToCartItems.push({
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
              quantity: undefined,
            });
          }
        });
      } else {
        oskarDepartures.map((entries, index) => {
          if (entries.ID == departureID) {
            singleItemPrice = entries.actual_price;
            addToCartItems.push({
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
              quantity: 1,
            });
          }
        });
      }

      window.dataLayer.push({ event_params: null, ecommerce: null });

      window.dataLayer.push({
        event: "RO_event_EEC",
        event_params: {
          gtm_name: "EEC_add_to_cart",
        },
        ecommerce: {
          currency: "EUR",
          items: addToCartItems,
        },
      });
    });
  };

  let getDepartureId;
  $(".application-form-cta").click(async function () {
    getDepartureId = $(this).data("departure-id");
  });

  let additionalPerson = () => {
    let additionalPerson = [];
    oskarDepartures.map((entries, index) => {
      if (entries.ID == getDepartureId) {
        additionalPerson.push({
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
          quantity: 1,
        });
      }
    });
    window.dataLayer.push({ event_params: null, ecommerce: null });

    window.dataLayer.push({
      event: "RO_event_EEC",
      event_params: {
        gtm_name: "EEC_add_to_cart",
      },
      ecommerce: {
        currency: "EUR",
        items: additionalPerson,
      },
    });
  };

  let addOn = (addOnPrice) => {
    let addOnProduct = [];
    oskarDepartures.map((entries, index) => {
      if (entries.ID == getDepartureId) {
        addOnProduct.push({
          item_id: entries.product_id,
          item_name: entries.travel_name,
          item_brand: "Agencija Oskar",
          item_category: "Travel",
          item_category2: entries.country_name,
          price: addOnPrice,
          discount: entries.price - entries.actual_price,
          affiliation: undefined,
          travel_departure_date: entries.departure_start_date,
          travel_style: entries.travel_style,
          travel_type: undefined,
          travel_group_size: entries.velikost_skupine,
          travel_duration: entries.travel_duration,
          travel_guide_id: undefined,
          product_type: "Add-on",
          travel_age_group: undefined,
          quantity: 1,
        });
      }
    });
    window.dataLayer.push({ event_params: null, ecommerce: null });

    window.dataLayer.push({
      event: "RO_event_EEC",
      event_params: {
        gtm_name: "EEC_add_to_cart",
      },
      ecommerce: {
        currency: "EUR",
        items: addOnProduct,
      },
    });
  };

  let removeAddOn = (addOnPrice) => {
    let addOnProduct = [];
    oskarDepartures.map((entries, index) => {
      if (entries.ID == getDepartureId) {
        addOnProduct.push({
          item_id: entries.product_id,
          item_name: entries.travel_name,
          item_brand: "Agencija Oskar",
          item_category: "Travel",
          item_category2: entries.country_name,
          price: addOnPrice,
          discount: entries.price - entries.actual_price,
          affiliation: undefined,
          travel_departure_date: entries.departure_start_date,
          travel_style: entries.travel_style,
          travel_type: undefined,
          travel_group_size: entries.velikost_skupine,
          travel_duration: entries.travel_duration,
          travel_guide_id: undefined,
          product_type: "Add-on",
          travel_age_group: undefined,
          quantity: 1,
        });
      }
    });
    window.dataLayer.push({ event_params: null, ecommerce: null });

    window.dataLayer.push({
      event: "RO_event_EEC",
      event_params: {
        gtm_name: "EEC_remove_from_cart",
      },
      ecommerce: {
        currency: "EUR",
        items: addOnProduct,
      },
    });
  };

  if (pageHasList > 0) {
    addToCart();
  }

  // Adding the main products to the basket (additional persons)
  // form open
  $(document).ajaxComplete(function (event, xhr, settings) {
    if (
      settings.url === ajaxurl &&
      settings.data.indexOf("action=get_departure_for_application_form") > -1
    ) {
      setTimeout(() => {
        // additional person added
        $('[ng-click="addAdult()"], [ng-click="addChild()"]').click(
          function () {
            additionalPerson();
            additionalPersonRemoved();
          }
        );

        // additional person removed
        let additionalPersonRemoved = () => {
          $(
            '[ng-click="removeAdult(key)"], [ng-click="removeChild(key)"]'
          ).click(function () {
            console.log("person removed");
          });
        };

        // extra bed
        $('[name="is_on_extra_bed"]').change(function () {
          if ($(this)[0].checked) {
            addOn(0);
          } else {
            removeAddOn(0);
          }
        });

        // surcharges
        $('[name="extra_payments[]"]').change(async function () {
          let rawValue = $(this).parent().find("span").text();
          let addOnPrice;

          if (rawValue.indexOf("%") > -1) {
            cancellationPercentage = rawValue
              .replace("%", "")
              .replace(/\s/g, "");
            addOnPrice = Number(
              singleItemPrice * (cancellationPercentage / 100)
            ).toFixed(2);
          } else {
            addOnPrice = rawValue.replace("€", "").replace(/\s/g, "");
          }

          if ($(this)[0].checked) {
            //console.log("added", addOnPrice);
            addOn(addOnPrice);
          } else {
            //console.log("removed", addOnPrice);
            removeAddOn(addOnPrice);
          }
        });
      }, 2000);
    }
  });
});
