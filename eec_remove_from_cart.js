jQuery(document).ready(function ($) {
  // prepare departure id
  let depId;
  $(".application-form-cta").click(function () {
    depId = $(this).data("departure-id");
  });

  let extraBed0;

  let removeFromCart = () => {
    let removeFromCartItems = [];

    if ($("body").hasClass("single-potovanja")) {
      oskarDepartures2.map((entries, index) => {
        if (entries.ID == depId) {
          removeFromCartItems.push({
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
          if (extraBed0.is(":checked") == true) {
            removeFromCartItems.push({
              item_id: undefined,
              item_name: "Želim bivati v sobi z dodatnim ležiščem",
              item_brand: "Agencija Oskar",
              item_category: "Travel",
              item_category2: entries.country_name,
              price: 0,
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
        }
      });
    } else {
      oskarDepartures.map((entries, index) => {
        if (entries.ID == depId) {
          removeFromCartItems.push({
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
          if (extraBed0.is(":checked") == true) {
            removeFromCartItems.push({
              item_id: undefined,
              item_name: "Želim bivati v sobi z dodatnim ležiščem",
              item_brand: "Agencija Oskar",
              item_category: "Travel",
              item_category2: entries.country_name,
              price: 0,
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
        }
      });
    }

    window.dataLayer.push({ event_params: null, ecommerce: null });

    window.dataLayer.push({
      event: "RO_event_EEC",
      event_params: {
        gtm_name: "EEC_remove_from_cart",
      },
      ecommerce: {
        currency: "EUR",
        items: removeFromCartItems,
      },
    });
  };

  $(document).ajaxComplete(function (event, xhr, settings) {
    if (
      settings.url === ajaxurl &&
      settings.data.indexOf("action=get_departure_for_application_form") > -1
    ) {
      setTimeout(() => {
        let formStatus;
        $(".application-form-close").mouseover(function () {
          formStatus = $(".application-form--content--inner--nav--item")
            .eq(0)
            .hasClass("active");
          console.log(formStatus);
        });

        $(".application-form-close").on("click", async function () {
          extraBed0 = $('[name="is_on_extra_bed"]');
          if (formStatus == true) {
            await removeFromCart(); // Wait for removeFromCart to complete
            console.log(formStatus);
          } else {
            console.log(formStatus);
          }
        });
      }, 2000);
    }
  });
});
