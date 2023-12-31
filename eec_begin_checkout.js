jQuery(document).ready(function ($) {
  var pageHasList = $(".table--departures").length;

  let checkoutDepartureId;

  $(".application-form-cta").click(async function () {
    checkoutDepartureId = $(this).data("departure-id");
  });

  let eecBeginCheckout = () => {
    let checkoutData = [];
    let cartPrice;

    if ($("body").hasClass("single-potovanja")) {
      oskarDepartures2.map((entries, index) => {
        if (entries.ID == checkoutDepartureId) {
          cartPrice = entries.actual_price;
          checkoutData.push({
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
            coupon: undefined,
          });
        }
      });
    } else {
      oskarDepartures.map((entries, index) => {
        if (entries.ID == checkoutDepartureId) {
          cartPrice = entries.actual_price;
          checkoutData.push({
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
            coupon: undefined,
          });
        }
      });
    }

    window.dataLayer.push({ event_params: null, ecommerce: null });

    window.dataLayer.push({
      event: "RO_event_EEC",
      event_params: {
        gtm_name: "EEC_begin_checkout",
      },
      ecommerce: {
        currency: "EUR",
        value: cartPrice,
        coupon: undefined,
        items: checkoutData,
      },
    });
  };

  // form open
  $(document).ajaxComplete(function (event, xhr, settings) {
    if (
      settings.url === ajaxurl &&
      settings.data.indexOf("action=get_departure_for_application_form") > -1
    ) {
      console.log("from data -->", settings.data);
      setTimeout(() => {
        $('select[ng-model="applicationFormObject.payment_term_code"]').change(
          function () {
            methodOfPayment = $(this).find(":selected").text();
            console.log(methodOfPayment);
          }
        );
        eecBeginCheckout();
      }, 2000);
    }
  });
});
