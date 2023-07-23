jQuery(document).ready(function ($) {
  var pageHasList = $(".table--departures").length;

  // prepare departure id
  let purchaseDepartureID = "";
  $(".application-form-cta").click(function () {
    purchaseDepartureID = $(this).data("departure-id");
  });

  // prepare other data
  let applicationType;
  let userType;
  let paymentMethod;
  let methodOfPayment = "payment in full";
  let cartQuantity;
  let cartSinglePrice;
  let currentPriceListId;
  let travelId;
  let totalPurchaseValue;

  // get current date
  let today = new Date();
  let day = today.getDate().toString().padStart(2, "0");
  let month = (today.getMonth() + 1).toString().padStart(2, "0");
  let year = today.getFullYear();
  let dateToday = `${year}${month}${day}`;

  // for extrapayments
  let extra_item_category2;
  let extra_price;
  let extra_discount;
  let extra_travel_departure_date;
  let extra_travel_style;
  let extra_travel_group_size;
  let extra_travel_duration;
  let extra_travel_guide_id;

  let allExtraPayments = [];
  let allExtraBeds = [];

  let getExtraPayments = () => {
    $('[ng-click="saveApplicationForm()"]').mouseover(async function () {
      allExtraPayments = [];
      $(
        '[ng-click="selectExtraPaymentForApplicationHolder(extra_payment)"], [ng-click="selectPassengerExtraPayment(extra_payment, key, true)"], [ng-click="selectPassengerExtraPayment(extra_payment, key, false)"]'
      ).each(async function () {
        let thisExtraPayment = $(this);
        if (thisExtraPayment.is(":checked") == true) {
          let surchargeValue = thisExtraPayment.val();
          let extraData = JSON.parse(surchargeValue);
          let extraPaymentName = extraData.extra_payment_name;
          let extraPaymentPrice;
          if (extraData.extra_payment_price == "") {
            extraPaymentPrice = (
              Number(cartSinglePrice) *
              Number(extraData.extra_payment_percentage)
            ).toFixed(2);
          } else {
            extraPaymentPrice = extraData.extra_payment_price;
          }

          allExtraPayments.push({
            item_id: undefined,
            item_name: extraPaymentName,
            item_brand: "Agencija Oskar",
            item_category: "Travel",
            item_category2: extra_item_category2,
            price: extraPaymentPrice,
            discount: extra_discount,
            affiliation: undefined,
            travel_departure_date: extra_travel_departure_date,
            travel_style: extra_travel_style,
            travel_type: undefined,
            travel_group_size: extra_travel_group_size,
            travel_duration: extra_travel_duration,
            travel_guide_id: undefined,
            product_type: "Add-on",
            travel_age_group: undefined,
            quantity: 1,
          });
        }
      });

      $(
        '[ng-model="applicationFormHolder.is_on_extra_bed"],[ng-model="adult.is_on_extra_bed"],[ng-model="child.is_on_extra_bed"]'
      ).each(async function () {
        allExtraBeds = [];
        if ($(this).is(":checked") == true) {
          allExtraBeds.push({
            item_id: undefined,
            item_name: "Želim bivati v sobi z dodatnim ležiščem",
            item_brand: "Agencija Oskar",
            item_category: "Travel",
            item_category2: extra_item_category2,
            price: 0,
            discount: extra_discount,
            affiliation: undefined,
            travel_departure_date: extra_travel_departure_date,
            travel_style: extra_travel_style,
            travel_type: undefined,
            travel_group_size: extra_travel_group_size,
            travel_duration: extra_travel_duration,
            travel_guide_id: undefined,
            product_type: "Add-on",
            travel_age_group: undefined,
            quantity: 1,
          });
        }
      });
    });
  };

  // form open
  $(document).ajaxComplete(function (event, xhr, settings) {
    if (
      settings.url === ajaxurl &&
      settings.data.indexOf("action=get_departure_for_application_form") > -1
    ) {
      setTimeout(() => {
        $('select[ng-model="applicationFormObject.payment_term_code"]').change(
          function () {
            methodOfPayment = $(this).find(":selected").text();
            console.log(methodOfPayment);
          }
        );
        getExtraPayments();
      }, 2000);
    }
  });

  // trigger purchase event
  $(document).ajaxComplete(function (event, xhr, settings) {
    if (
      settings.url === ajaxurl &&
      settings.data.indexOf("action=save_application_form") > -1
    ) {
      console.log("settings ->", settings);
      var formData = new URLSearchParams(settings.data);
      let newFormData = Object.fromEntries(formData);

      console.log("new form data", newFormData);

      cartQuantity = newFormData["application_form[passengers_number]"];
      currentPriceListId =
        newFormData["application_form[price_list][current_price_list_id]"];

      let payOnline = newFormData["application_form[pay_online]"];
      let formApplicationType =
        newFormData["application_form[application_form_type]"];
      if (formApplicationType == "2") {
        applicationType = "Final";
      } else {
        applicationType = "Informative";
      }
      let formUserType = newFormData["application_form[is_partner]"];
      if (formUserType == "1") {
        userType = "Legal person";
      } else {
        userType = "Physical person";
      }

      if (payOnline == "false") {
        paymentMethod = "Invoice";
        console.log("Purchase event triggered by @datio-it");
        triggerPurchaseEvent();
      }
    }
  });

  let triggerPurchaseEvent = async () => {
    let itemData = [];
    let departureStartDate;
    let travelGuideId;
    totalPurchaseValue = $(".application-form .price")
      .eq(0)
      .text()
      .replace("€", "");

    let fetchPotovanja = async (travel_id) => {
      const url = `/wp-json/wp/v2/potovanja/${travel_id}`;
      let res = await fetch(url);
      return await res.json();
    };
    let renderPotovanja = async (travel_id) => {
      let response = await fetchPotovanja(travel_id);
      travelGuideId = response.acf.travel_guid;
    };

    const selectedOskarDepartures = $("body").hasClass("single-potovanja")
      ? oskarDepartures2
      : oskarDepartures;

    selectedOskarDepartures.map(async (entries) => {
      if (entries.ID == purchaseDepartureID) {
        departureStartDate = entries.departure_start_date;
        cartSinglePrice = entries.actual_price;
        travelId = entries.travel_id;

        await renderPotovanja(travelId);

        extra_item_category2 = entries.country_name;
        extra_price = entries.actual_price;
        extra_discount = entries.price - entries.actual_price;
        extra_travel_departure_date = entries.departure_start_date;
        extra_travel_style = entries.travel_style;
        extra_travel_group_size = entries.velikost_skupine;
        extra_travel_duration = entries.travel_duration;
        extra_travel_guide_id = travelGuideId;

        itemData.push({
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
          travel_guide_id: travelGuideId,
          product_type: "Main",
          travel_age_group: undefined,
          quantity: cartQuantity,
          coupon: undefined,
        });

        transactionValue = entries.price;
      }
    });

    window.dataLayer.push({ event_params: null, ecommerce: null });

    window.dataLayer.push({
      event: "RO_event_EEC",
      event_params: {
        gtm_name: "EEC_purchase",
        application_type: applicationType,
        user_type: userType,
        payment_method: paymentMethod,
        installments: methodOfPayment,
        days_till_departure: Number(departureStartDate) - Number(dateToday),
      },
      ecommerce: {
        currency: "EUR",
        transaction_id: currentPriceListId,
        value: totalPurchaseValue,
        tax: undefined,
        shipping: undefined,
        coupon: undefined,
        affiliation: undefined,
        items: [...itemData, ...allExtraPayments, ...allExtraBeds],
      },
    });
  };
});
