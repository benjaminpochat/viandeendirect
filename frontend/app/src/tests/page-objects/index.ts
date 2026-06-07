/**
 * Page Objects Index
 * Exports all Page Objects for test usage
 */

// Authentication
import { NotAuthorizedForCustomersPage } from '../../authentication/views/NotAuthorizedForCustomers.pageObject';
import { NotAuthorizedForProducersPage } from '../../authentication/views/NotAuthorizedForProducers.pageObject';

// Customer
import { CustomerCreationFormPage } from '../../domains/customer/views/CustomerCreationForm.pageObject';
import { CustomersListPage } from '../../domains/customer/views/CustomersList.pageObject';

// Dashboard
import { DashboardPage } from '../../domains/dashboard/views/Dashboard.pageObject';

// Producer
import { ProducerAccountViewPage } from '../../domains/producer/views/ProducerAccountView.pageObject';

// Production
import { BeefProductionCreatorPage } from '../../domains/production/views/beefProduction/BeefProductionCreator.pageObject';
import { BeefProductionViewPage } from '../../domains/production/views/beefProduction/BeefProductionView.pageObject';
import { PackageLotsCreatorPage } from '../../domains/production/views/PackageLotsCreator.pageObject';
import { ProductionsListPage } from '../../domains/production/views/ProductionsList.pageObject';
import { PublicationBeefProductionToSalePage } from '../../domains/production/views/beefProduction/PublicationBeefProductionToSale.pageObject';

// Production Forms
import { BreedingPropertiesFormPage } from '../../domains/production/views/beefProduction/forms/BreedingPropertiesForm.pageObject';
import { CuttingPropertiesFormPage } from '../../domains/production/views/beefProduction/forms/CuttingPropertiesForm.pageObject';
import { SlaughterPropertiesFormPage } from '../../domains/production/views/beefProduction/forms/SlaughterPropertiesForm.pageObject';

// Sale
import { SaleFormPage } from '../../domains/sale/views/SaleForm.pageObject';
import { SalesListPage } from '../../domains/sale/views/SalesList.pageObject';
import { CustomerOrderFormPage } from '../../domains/sale/views/CustomerOrderForm.pageObject';
import { ProducerOrderFormPage } from '../../domains/sale/views/ProducerOrderForm.pageObject';
import { OrderViewPage } from '../../domains/sale/views/OrderView.pageObject';
import { OrdersListPage } from '../../domains/sale/views/OrdersList.pageObject';

// Export all Page Objects
export {
    // Authentication
    NotAuthorizedForCustomersPage,
    NotAuthorizedForProducersPage,
    
    // Customer
    CustomerCreationFormPage,
    CustomersListPage,
    
    // Dashboard
    DashboardPage,
    
    // Producer
    ProducerAccountViewPage,
    
    // Production
    BeefProductionCreatorPage,
    BeefProductionViewPage,
    PackageLotsCreatorPage,
    ProductionsListPage,
    PublicationBeefProductionToSalePage,
    
    // Production Forms
    BreedingPropertiesFormPage,
    CuttingPropertiesFormPage,
    SlaughterPropertiesFormPage,
    
    // Sale
    SaleFormPage,
    SalesListPage,
    CustomerOrderFormPage,
    ProducerOrderFormPage,
    OrderViewPage,
    OrdersListPage,
};
