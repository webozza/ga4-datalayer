jQuery(document).ready(function ($) {
  function generateTransactionID() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const randomChars = [];

    // Generate a random part
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomChars.push(characters[randomIndex]);
    }

    const transactionID = `${year}${month}${day}-${randomChars.join(
      ""
    )}-${hours}${minutes}${seconds}`;
    return transactionID;
  }

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
  let transactionId;

  // get current date
  let today = new Date();
  let day = today.getDate().toString().padStart(2, "0");
  let month = (today.getMonth() + 1).toString().padStart(2, "0");
  let year = today.getFullYear();
  let dateToday = `${year}${month}${day}`;

  let allExtraPayments = [];
  let allExtraBeds = [];

  let getExtraPayments = async () => {
    let fetchPotovanja = async (travel_id) => {
      const url = `/wp-json/wp/v2/potovanja/${travel_id}`;
      let res = await fetch(url);
      return await res.json();
    };
    let renderPotovanja = async (travel_id) => {
      let response = await fetchPotovanja(travel_id);
      travelGuideId = response.acf.travel_guid;
    };

    $('[ng-click="saveApplicationForm()"]').mouseover(async function () {
      const selectedOskarDepartures = $("body").hasClass("single-potovanja")
        ? oskarDepartures2
        : oskarDepartures;

      const promises = [];
      let allExtraPayments = [];
      let allExtraBeds = [];

      // Processing for extra payments
      $(
        '[ng-click="selectExtraPaymentForApplicationHolder(extra_payment)"], [ng-click="selectPassengerExtraPayment(extra_payment, key, true)"], [ng-click="selectPassengerExtraPayment(extra_payment, key, false)"]'
      ).each(function () {
        const thisExtraPayment = $(this);
        if (thisExtraPayment.is(":checked")) {
          const surchargeValue = thisExtraPayment.val();
          const extraData = JSON.parse(surchargeValue);
          const extraPaymentName = extraData.extra_payment_name;
          let extraPaymentPrice;

          if (extraData.extra_payment_price == "") {
            extraPaymentPrice = (
              Number(cartSinglePrice) *
              Number(extraData.extra_payment_percentage)
            ).toFixed(2);
          } else {
            extraPaymentPrice = extraData.extra_payment_price;
          }

          const promise = Promise.all(
            selectedOskarDepartures.map(async (entries) => {
              if (entries.ID == purchaseDepartureID) {
                departureStartDate = entries.departure_start_date;
                cartSinglePrice = entries.actual_price;
                travelId = entries.travel_id;

                await renderPotovanja(travelId);

                allExtraPayments.push({
                  // Populate the data here
                  item_id: undefined,
                  item_name: extraPaymentName,
                  item_brand: "Agencija Oskar",
                  item_category: "Travel",
                  item_category2: entries.country_name,
                  price: extraPaymentPrice,
                  discount: 0,
                  affiliation: undefined,
                  travel_departure_date: entries.departure_start_date,
                  travel_style: entries.travel_style,
                  travel_type: undefined,
                  travel_group_size: entries.velikost_skupine,
                  travel_duration: entries.travel_duration,
                  travel_guide_id: travelGuideId,
                  product_type: "Add-on",
                  travel_age_group: undefined,
                  quantity: 1,
                  coupon: undefined,
                });
              }
            })
          );

          promises.push(promise);
        }
      });

      // Processing for extra beds
      $(
        '[ng-model="applicationFormHolder.is_on_extra_bed"],[ng-model="adult.is_on_extra_bed"],[ng-model="child.is_on_extra_bed"]'
      ).each(function () {
        if ($(this).is(":checked")) {
          const promise = Promise.all(
            selectedOskarDepartures.map(async (entries) => {
              if (entries.ID == purchaseDepartureID) {
                departureStartDate = entries.departure_start_date;
                cartSinglePrice = entries.actual_price;
                travelId = entries.travel_id;

                await renderPotovanja(travelId);

                allExtraBeds.push({
                  // Populate the data here for extra beds
                  item_id: undefined,
                  item_name: "Želim bivati v sobi z dodatnim ležiščem",
                  item_brand: "Agencija Oskar",
                  item_category: "Travel",
                  item_category2: entries.country_name,
                  price: 0,
                  discount: 0,
                  affiliation: undefined,
                  travel_departure_date: entries.departure_start_date,
                  travel_style: entries.travel_style,
                  travel_type: undefined,
                  travel_group_size: entries.velikost_skupine,
                  travel_duration: entries.travel_duration,
                  travel_guide_id: travelGuideId,
                  product_type: "Add-on",
                  travel_age_group: undefined,
                  quantity: 1,
                  coupon: undefined,
                });
              }
            })
          );

          promises.push(promise);
        }
      });

      // Wait for all promises to resolve before moving forward
      await Promise.all(promises);

      // Now, allExtraPayments and allExtraBeds arrays will be fully populated.
      console.log(allExtraPayments);
      console.log(allExtraBeds);
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
  $(document).ajaxComplete(async function (event, xhr, settings) {
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
      transactionId = generateTransactionID();

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
        setTimeout(async () => {
          await triggerPurchaseEvent();
        }, 2200);
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

    await Promise.all(
      selectedOskarDepartures.map(async (entries) => {
        if (entries.ID == purchaseDepartureID) {
          departureStartDate = entries.departure_start_date;
          cartSinglePrice = entries.actual_price;
          travelId = entries.travel_id;

          await renderPotovanja(travelId);

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
      })
    );

    window.dataLayer.push({ event_params: null, ecommerce: null });

    console.log("yoyoyo", allExtraPayments, allExtraBeds);

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
        transaction_id: transactionId,
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
