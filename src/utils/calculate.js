const calculateOderTotal = (order) => {
  if (!order?.order_items) return;

  const totalItemPrice = order?.order_items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingCost = getShippingCost(order?.shipping_address.district);
  const pointsUsed = parseInt(order?.points_used) || 0;
  return totalItemPrice + shippingCost - pointsUsed;
};

const SHIPPING_COST = {
  dhaka: 60,
  outside: 120,
};

function getShippingCost(district) {
  if (typeof district !== "string") {
    throw new Error("The district must be a string.");
  }

  const normalizedDistrict = district.toLowerCase();
  const isDhaka = ["dhaka", "ঢাকা"].includes(normalizedDistrict);
  return isDhaka ? SHIPPING_COST.dhaka : SHIPPING_COST.outside;
}

export { getShippingCost };

export { calculateOderTotal };
