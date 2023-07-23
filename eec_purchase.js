jQuery(document).ready(function ($) {
  let allExtraPayments = [];
  let allExtraBeds = [];

  // Function to fetch potovanja data
  async function fetchPotovanja(travel_id) {
    const url = `/wp-json/wp/v2/potovanja/${travel_id}`;
    const res = await fetch(url);
    return await res.json();
  }

  // Function to render potovanja data
  async function renderPotovanja(travel_id) {
    const response = await fetchPotovanja(travel_id);
    return response.acf.travel_guid;
  }

  // Function to handle extra items (payments and beds)
  async function handleExtraItems(selector, dataContainer, itemName) {
    $(selector).each(async function () {
      if ($(this).is(":checked")) {
        const surchargeValue = $(this).val();
        const extraData = JSON.parse(surchargeValue);
        const extraPaymentName = extraData.extra_payment_name;
        let extraPaymentPrice =
          extraData.extra_payment_price !== ""
            ? extraData.extra_payment_price
            : (
                Number(cartSinglePrice) *
                Number(extraData.extra_payment_percentage)
              ).toFixed(2);

        // Extract other required data (departureStartDate, cartSinglePrice, travelId)
        const selectedOskarDepartures = $("body").hasClass("single-potovanja")
          ? oskarDepartures2
          : oskarDepartures;

        const entry = selectedOskarDepartures.find(
          (entry) => entry.ID === purchaseDepartureID
        );

        if (!entry) return;

        const departureStartDate = entry.departure_start_date;
        const cartSinglePrice = entry.actual_price;
        const travelId = entry.travel_id;
        const travelGuideId = await renderPotovanja(travelId);

        dataContainer.push({
          item_id: undefined,
          item_name: extraPaymentName,
          item_brand: "Agencija Oskar",
          item_category: "Travel",
          item_category2: entry.country_name,
          price: extraPaymentPrice,
          discount: entry.price - entry.actual_price,
          affiliation: undefined,
          travel_departure_date: entry.departure_start_date,
          travel_style: entry.travel_style,
          travel_type: undefined,
          travel_group_size: entry.velikost_skupine,
          travel_duration: entry.travel_duration,
          travel_guide_id: travelGuideId,
          product_type: "Add-on",
          travel_age_group: undefined,
          quantity: 1,
          coupon: undefined,
        });
      }
    });
  }

  // Function to handle form open and trigger purchase event
  $(document).ajaxComplete(function (event, xhr, settings) {
    if (
      settings.url === ajaxurl &&
      settings.data.indexOf("action=get_departure_for_application_form") > -1
    ) {
      setTimeout(() => {
        // Handle extra payments and extra beds
        handleExtraItems(
          '[ng-click^="selectExtraPayment"], [ng-click^="selectPassengerExtraPayment"]',
          allExtraPayments,
          "extra_payment_name"
        );

        handleExtraItems(
          '[ng-model^="applicationFormHolder.is_on_extra_bed"],[ng-model^="adult.is_on_extra_bed"],[ng-model^="child.is_on_extra_bed"]',
          allExtraBeds,
          "Želim bivati v sobi z dodatnim ležiščem"
        );

        $('select[ng-model="applicationFormObject.payment_term_code"]').change(
          function () {
            methodOfPayment = $(this).find(":selected").text();
            console.log(methodOfPayment);
          }
        );
      }, 2000);
    } else if (
      settings.url === ajaxurl &&
      settings.data.indexOf("action=save_application_form") > -1
    ) {
      var formData = new URLSearchParams(settings.data);
      let newFormData = Object.fromEntries(formData);

      cartQuantity = newFormData["application_form[passengers_number]"];
      currentPriceListId =
        newFormData["application_form[price_list][current_price_list_id]"];

      let payOnline = newFormData["application_form[pay_online]"];
      let formApplicationType =
        newFormData["application_form[application_form_type]"];
      applicationType = formApplicationType == "2" ? "Final" : "Informative";

      let formUserType = newFormData["application_form[is_partner]"];
      userType = formUserType == "1" ? "Legal person" : "Physical person";

      if (payOnline == "false") {
        paymentMethod = "Invoice";
        triggerPurchaseEvent();
      }
    }
  });

  // Function to trigger the purchase event
  async function triggerPurchaseEvent() {
    let itemData = [];
    let departureStartDate;
    let travelGuideId;
    totalPurchaseValue = $(".application-form .price")
      .eq(0)
      .text()
      .replace("€", "");

    // Extract other required data (cartSinglePrice, travelId)
    const selectedOskarDepartures = $("body").hasClass("single-potovanja")
      ? oskarDepartures2
      : oskarDepartures;

    const entry = selectedOskarDepartures.find(
      (entry) => entry.ID === purchaseDepartureID
    );

    if (!entry) return;

    const cartSinglePrice = entry.actual_price;
    const travelId = entry.travel_id;
    const travelGuideId = await renderPotovanja(travelId);

    itemData.push({
      item_id: entry.product_id,
      item_name: entry.travel_name,
      item_brand: "Agencija Oskar",
      item_category: "Travel",
      item_category2: entry.country_name,
      price: entry.actual_price,
      discount: entry.price - entry.actual_price,
      affiliation: undefined,
      travel_departure_date: entry.departure_start_date,
      travel_style: entry.travel_style,
      travel_type: undefined,
      travel_group_size: entry.velikost_skupine,
      travel_duration: entry.travel_duration,
      travel_guide_id: travelGuideId,
      product_type: "Main",
      travel_age_group: undefined,
      quantity: cartQuantity,
      coupon: undefined,
    });

    transactionValue = entry.price;

    // Push dataLayer events
    window.dataLayer.push({ event_params: null, ecommerce: null });

    window.dataLayer.push({
      event: "RO_event_EEC",
      event_params: {
        gtm_name: "EEC_purchase",
        application_type: applicationType,
        user_type: userType,
        payment_method: paymentMethod,
        installments: methodOfPayment,
        days_till_departure:
          Number(entry.departure_start_date) - Number(dateToday),
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
  }
});
