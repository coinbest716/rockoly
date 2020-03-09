// Calculate booking price
export const priceCalculator = (
  baseRate,
  guest,
  complexity,
  additionalServices,
  previousAdditinalServicePrice
) => {
  let newServicePrice = 0;
  if (previousAdditinalServicePrice) {
    newServicePrice = previousAdditinalServicePrice;
  }
  let price = 0;
  if (baseRate && guest && complexity) {
    if (guest <= 5) {
      price = baseRate * guest * complexity + additionalServices + newServicePrice;
      return price;
    } else if (guest > 5) {
      price += baseRate * 5;
      price += (guest - 5) * (baseRate / 2);
      price *= complexity;
      price += additionalServices + newServicePrice;
      // price = baseRate * 5 + (guest - 5) * (baseRate / 2) * complexity + additionalServices;
      return price;
    }
  } else {
    return baseRate;
  }
};
