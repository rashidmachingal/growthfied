
const getCoupenStatus = (end_date, used, count) => {
    const todayDate = new Date()
    const endDate = new Date(end_date)
    const isExpired = endDate < todayDate
    if(isExpired === true) return "Expired"
    if(count - used === 0) return "Completed"
    return "Running"
}

const getCoupenPercentDiscount = (totalPrice, discountPercentage) => {
    const discountAmount = (discountPercentage / 100) * totalPrice;
    return discountAmount;
}

const getItemsDiscount = (items) => {
  let totalDiscount = 0;
      items.forEach(product => {
        if(product.original_price > product.selling_price){
          const original_price = (product.original_price - product.selling_price) * product.quantity;
          totalDiscount += original_price;
        }
    });
    return totalDiscount
}

const calculateExpectedDeliveryDate = (orderDate, deliveryDays) => {
  const orderDateObj = new Date(orderDate);
  orderDateObj.setDate(orderDateObj.getDate() + deliveryDays);
  return orderDateObj
};

const getTotalPMOfferAmount = (items) => {
  return items?.reduce((total, item) => {
    if (item?.discount_based_pm?.allow) {
      const offerAmount = (item?.selling_price - item?.discount_based_pm?.selling_price) * item?.quantity;
      return total + offerAmount;
    }
    return total;
  }, 0);
};

module.exports = { getCoupenStatus, getCoupenPercentDiscount, getItemsDiscount, calculateExpectedDeliveryDate, getTotalPMOfferAmount }