type Product = {
  unitsPerContainer: number; // Number of units in a container (e.g., tablets, capsules, etc.)
  containersInStock: number; // Number of containers in stock
  openContainerUnits: number; // Number of units in the open container
};

export const calculateRemainingStock = (
  product: Product,
  unitsSold: number
): { error: boolean; msg: string; remainingContainers?: number; remainingUnits?: number } => {
  
  // if (unitsSold < 0) {
  //   return {
  //     error: true,
  //     msg: 'Quantity sold cannot be negative.',
  //   };
  // }

  const totalUnitsInStock =
    product.containersInStock * product.unitsPerContainer +
    product.openContainerUnits;

  if (unitsSold > totalUnitsInStock) {
    return {
      error: true,
      msg: 'Insufficient stock to fulfill the request.',
    };
  }

  let remainingUnits = product.openContainerUnits;

  // Deduct from the open container first
  if (remainingUnits >= unitsSold) {
    remainingUnits -= unitsSold;
  } else {
    // Deduct from the open container and then move to closed containers
    unitsSold -= remainingUnits;
    const closedContainersToDeduct = Math.ceil(unitsSold / product.unitsPerContainer);
    const remainingClosedContainers = Math.max(
      product.containersInStock - closedContainersToDeduct,
      0
    );

    remainingUnits =
      closedContainersToDeduct * product.unitsPerContainer - unitsSold;

    return {
      error: false,
      msg: '',
      remainingContainers: remainingClosedContainers,
      remainingUnits,
    };
  }

  return {
    error: false,
    msg: '',
    remainingContainers: product.containersInStock,
    remainingUnits,
  };
};
