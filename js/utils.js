function getDietType(dish) {
  return dish.dietary || (dish.veg ? 'veg' : 'non-veg');
}

function getDietLabel(dish) {
  var t = getDietType(dish);
  if (t === 'veg')   return 'Veg';
  if (t === 'vegan') return 'Vegan';
  return 'Non Veg';
}

function getTotalItems(cart) {
  var total = 0;
  Object.values(cart).forEach(function (e) { total += e.quantity; });
  return total;
}
