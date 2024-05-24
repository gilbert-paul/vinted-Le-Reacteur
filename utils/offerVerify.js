/**
 *
 * @param {Object} offer
 * @returns {Array}
 */
const offerVerify = (offer) => {
  const informationsArray = [
    offer.title,
    offer.description,
    offer.price,
    offer.condition,
    offer.city,
    offer.brand,
    offer.size,
    offer.color,
  ];
  const keysInformations = [
    "title",
    "description",
    "price",
    "condition",
    "city",
    "brand",
    "size",
    "color",
  ];
  const missingInformations = [];
  for (let i = 0; i < informationsArray.length; i++) {
    if (!informationsArray[i]) {
      if (missingInformations.length === 0) {
        keysInformations[i] =
          keysInformations[i].slice(0, 1).toUpperCase() +
          keysInformations[i].slice(1);
        missingInformations.push(`${keysInformations[i]}`);
      } else {
        missingInformations.push(`, ${keysInformations[i]}`);
      }
    }
  }
  return missingInformations;
};

module.exports = offerVerify;
