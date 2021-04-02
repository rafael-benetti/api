interface Permissions {
  generateReports: boolean;

  createGroups: boolean;
  editGroups: boolean;
  deleteGroups: boolean;

  createRoutes: boolean;
  editRoutes: boolean;
  deleteRoutes: boolean;

  createPointsOfSale: boolean;
  editPointsOfSale: boolean;
  deletePointsOfSale: boolean;

  createProducts: boolean;
  editProducts: boolean;
  deleteProducts: boolean;

  createCategories: boolean;
  editCategories: boolean;
  deleteCategories: boolean;

  createMachines: boolean;
  editMachines: boolean;
  deleteMachines: boolean;

  createManagers: boolean;
  listManagers: boolean;

  createOperators: boolean;
  listOperators: boolean;

  addRemoteCredit: boolean;
  toggleMaintenanceMode: boolean;

  editCollections: boolean;
  deleteCollections: boolean;
}

export default Permissions;
