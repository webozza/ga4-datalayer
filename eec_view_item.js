jQuery(document).ready(function ($) {
  let eecViewItem = (departure_id) => {
    window.dataLayer.push({ event_params: null, ecommerce: null });

    let viewItem = [];

    oskarDepartures2.map((entries, index) => {
      if (entries.ID == departure_id) {
        viewItem.push({
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
        });
      }
    });

    window.dataLayer.push({
      event: "RO_event_EEC",
      event_params: {
        gtm_name: "EEC_view_item",
      },
      ecommerce: {
        currency: "EUR",
        items: viewItem,
      },
    });
  };

  if ($("body").hasClass("single-potovanja")) {
    let departure_id = $(".application-form-cta").eq(0).data("departure-id");
    eecViewItem(departure_id);
  }
});
