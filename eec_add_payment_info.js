jQuery(document).ready(function ($) {
  var pageHasList = $(".table--departures").length;

  let departureID = "";
  $(".application-form-cta").click(function () {
    departureID = $(this).data("departure-id");
  });

  let add_payment_info = () => {
    $('input[name="pay_online"], input[name="send_proforma_invoice"]').change(
      function () {
        let paymentMethodSelected;
        let cartPrice;
        let adultQuantity = $('[ng-click="addAdult()"]')
          .prev()
          .text()
          .match(/\d+/)[0];
        let childQuanity = $('[ng-click="addChild()"]')
          .prev()
          .text()
          .match(/\d+/)[0];

        let checkedPaymentOption = $(this)[0].checked;
        if (checkedPaymentOption) {
          let inputName = $(this).attr("name");
          if (inputName == "pay_online") {
            paymentMethodSelected = "Credit Card";
          } else {
            paymentMethodSelected = "Proforma invoice";
          }
        }
        let addPaymentInfo = [];

        if ($("body").hasClass("single-potovanja")) {
          oskarDepartures2.map((entries, index) => {
            if (entries.ID == departureID) {
              cartPrice = entries.actual_price;
              addPaymentInfo.push({
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
                quantity: Number(adultQuantity) + Number(childQuanity) + 1,
              });
            }
          });
        } else {
          oskarDepartures.map((entries, index) => {
            if (entries.ID == departureID) {
              cartPrice = entries.price;
              addPaymentInfo.push({
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
                quantity: Number(adultQuantity) + Number(childQuanity) + 1,
              });
            }
          });
        }

        window.dataLayer.push({ event_params: null, ecommerce: null });

        window.dataLayer.push({
          event: "RO_event_EEC",
          event_params: {
            gtm_name: "EEC_add_payment_info",
          },
          ecommerce: {
            currency: "EUR",
            value: cartPrice,
            coupon: undefined,
            payment_type: paymentMethodSelected,
            items: addPaymentInfo,
          },
        });
      }
    );
  };

  if (pageHasList > 0) {
    $(document).ajaxComplete(function (event, xhr, settings) {
      if (
        settings.url === ajaxurl &&
        settings.data.indexOf("action=get_departure_for_application_form") > -1
      ) {
        setTimeout(() => {
          add_payment_info();
        }, 2000);
      }
    });
  }
});
