jQuery(document).ready(function ($) {
  let eecViewItem = () => {
    window.dataLayer.push({ event_params: null, ecommerce: null });

    let actualPrice = $(".single-potovanja .price a")
      .text()
      .replaceAll(" ", "");

    window.dataLayer.push({
      event: "RO_event_EEC",
      event_params: {
        gtm_name: "EEC_view_item",
      },
      ecommerce: {
        currency: "EUR",
        items: [
          {
            item_id: oskarDepartures.product_id,
            item_name: oskarDepartures.travel_name,
            item_brand: "Agencija Oskar",
            item_category: "Travel",
            item_category2: oskarDepartures.country_name,
            price: actualPrice,
            discount: oskarDepartures.price - actualPrice,
            affiliation: undefined,
            travel_departure_date: oskarDepartures.departure_start_date,
            travel_style: oskarDepartures.travel_style,
            travel_type: undefined,
            travel_group_size: oskarDepartures.velikost_skupine,
            travel_duration: oskarDepartures.travel_duration,
            travel_guide_id: oskarDepartures.travel_guide_id,
            product_type: "Main",
            travel_age_group: undefined,
          },
        ],
      },
    });
  };

  if ($("body").hasClass("single-potovanja")) {
    eecViewItem();
  }
});
