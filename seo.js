// Description of the places for Google (schema.org "structured data", JSON-LD).
// Google reads it and can show the places better in search. Pure: easy to test.

const SCHEMA_TYPE = { cafe: "CafeOrCoffeeShop", coworking: "LocalBusiness", library: "Library" };
const ALL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
// Our closedDays use 0 = Sunday … 6 = Saturday (like JavaScript dates)
const DAY_BY_NUMBER = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function openingHours(place) {
  if (!place.hours) return undefined;
  const closed = (place.closedDays ?? []).map((d) => DAY_BY_NUMBER[d]);
  const dayOfWeek = ALL_DAYS.filter((d) => !closed.includes(d));
  const [opens, closes] = place.hours === "24/7" ? ["00:00", "23:59"] : [place.hours.open, place.hours.close];
  return [{ "@type": "OpeningHoursSpecification", dayOfWeek, opens, closes }];
}

export function placesJsonLd(places, siteUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Кафе и коворкинги Бишкека для работы с ноутбуком",
    url: siteUrl,
    itemListElement: places.map((place, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": SCHEMA_TYPE[place.type] ?? "LocalBusiness",
        name: place.name,
        url: `${siteUrl}#place=${place.id}`,
        address: {
          "@type": "PostalAddress",
          streetAddress: place.address,
          addressLocality: "Бишкек",
          addressCountry: "KG",
        },
        geo: place.coords
          ? { "@type": "GeoCoordinates", latitude: place.coords.lat, longitude: place.coords.lng }
          : undefined,
        openingHoursSpecification: openingHours(place),
        amenityFeature: [{ "@type": "LocationFeatureSpecification", name: "Wi-Fi", value: true }],
      },
    })),
  };
}
