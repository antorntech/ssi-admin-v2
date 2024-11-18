const calculateOderTotal = (order) => {
  if (!order?.order_items) return;

  const totalItemPrice = order?.order_items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingCost =
    order?.shipping_address.district.toLowerCase() === "dhaka" ? 60 : 120;
  const pointsUsed = parseInt(order?.points_used) || 0;
  return totalItemPrice + shippingCost - pointsUsed;
};

export { calculateOderTotal };
