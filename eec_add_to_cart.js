jQuery(document).ready(function ($) {
  var pageHasList = $(".table--departures").length;

  let purchaseDepartureID = "";
  let addToCart = () => {
    $(".application-form-cta").click(async function () {
      let departureID = $(this).data("departure-id");
      purchaseDepartureID = departureID;
      console.log("purchase-departure-id", purchaseDepartureID);
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

  if (pageHasList > 0) {
    addToCart();
  }
});
