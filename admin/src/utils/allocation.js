export function getRequested(item) {
  return Number(item?.asked_quantity ?? item?.requested_quantity ?? item?.quantity ?? 0);
}

export function getAllocated(item) {
  return Number(item?.provided_quantity ?? item?.approved_quantity ?? 0);
}

export function getAllocationMetrics(item, availableStock) {
  const requested = getRequested(item);
  const alreadyAllocated = getAllocated(item);
  const remainingRequest = Math.max(0, requested - alreadyAllocated);
  const stock = Number(availableStock ?? 0);
  const maxAllocatable = Math.min(remainingRequest, stock);
  return { requested, alreadyAllocated, remainingRequest, availableStock: stock, maxAllocatable };
}

export function validateAllocation(qty, remainingRequest, availableStock) {
  if (!Number.isFinite(qty) || qty < 0) return 'Enter a quantity of 0 or more.';
  if (qty === 0) return 'Enter an allocation greater than 0.';
  if (qty > remainingRequest) return `Cannot allocate more than the remaining request of ${remainingRequest}.`;
  if (qty > availableStock) return `Cannot allocate more than available stock of ${availableStock}.`;
  return null;
}
