import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/auth/login.page';
import { PurchaseRequestFormPage } from '../pages/purchase-request/purchase-request-form.page';
import { PurchaseRequestListPage } from '../pages/purchase-request/purchase-request-list.page';
import { PurchaseRequestDisplayPage } from '../pages/purchase-request/purchase-request-display.page';
import { PurchaseOrderListPage } from '../pages/purchase-order/purchase-order-list.page';
import { PurchaseOrderFormPage } from '../pages/purchase-order/purchase-order-form.page';
import { PurchaseOrderDisplayPage } from '../pages/purchase-order/purchase-order-display.page';
import { RequestForQuotationListPage } from '../pages/request-for-quotation/request-for-quotation-list.page';
import { RequestForQuotationFormPage } from '../pages/request-for-quotation/request-for-quotation-form.page';
import { RequestForQuotationDisplayPage } from '../pages/request-for-quotation/request-for-quotation-display.page';
import { ApprovalSetupMasterListPage } from '../pages/approval-setup-master/approval-setup-master-list.page';
import { ApprovalSetupMasterFormPage } from '../pages/approval-setup-master/approval-setup-master-form.page';
import { ApprovalSetupMasterDisplayPage } from '../pages/approval-setup-master/approval-setup-master-display.page';
import { ItemMasterListPage } from '../pages/item-master/item-master-list.page';
import { ItemMasterFormPage } from '../pages/item-master/item-master-form.page';
import { WarehouseMasterListPage } from '../pages/warehouse-master/warehouse-master-list.page';
import { WarehouseMasterFormPage } from '../pages/warehouse-master/warehouse-master-form.page';
import { AnnouncementMasterListPage } from '../pages/announcement-master/announcement-master-list.page';
import { AnnouncementMasterFormPage } from '../pages/announcement-master/announcement-master-form.page';
import { ItemCategoryMasterListPage } from '../pages/item-category-master/item-category-master-list.page';
import { ItemCategoryMasterFormPage } from '../pages/item-category-master/item-category-master-form.page';
import { ItemGroupMasterListPage } from '../pages/item-group-master/item-group-master-list.page';
import { ItemGroupMasterFormPage } from '../pages/item-group-master/item-group-master-form.page';
import { InformToGroupMasterListPage } from '../pages/inform-to-group-master/inform-to-group-master-list.page';
import { InformToGroupMasterFormPage } from '../pages/inform-to-group-master/inform-to-group-master-form.page';
import { LocationMasterListPage } from '../pages/location-master/location-master-list.page';
import { LocationMasterFormPage } from '../pages/location-master/location-master-form.page';
import { CompanyMasterListPage } from '../pages/company-master/company-master-list.page';
import { CompanyMasterFormPage } from '../pages/company-master/company-master-form.page';
import { CompanyLocationMasterListPage } from '../pages/company-location-master/company-location-master-list.page';
import { CompanyLocationMasterFormPage } from '../pages/company-location-master/company-location-master-form.page';
import { DepartmentMasterListPage } from '../pages/department-master/department-master-list.page';
import { DepartmentMasterFormPage } from '../pages/department-master/department-master-form.page';
import { DivisionMasterListPage } from '../pages/division-master/division-master-list.page';
import { DivisionMasterFormPage } from '../pages/division-master/division-master-form.page';
import { DocTypeMasterListPage } from '../pages/doc-type-master/doc-type-master-list.page';
import { DocTypeMasterFormPage } from '../pages/doc-type-master/doc-type-master-form.page';
import { VendorRegistrationListPage } from '../pages/vendor-registration/vendor-registration-list.page';
import { VendorRegistrationFormPage } from '../pages/vendor-registration/vendor-registration-form.page';
import {
  VendorMasterListPage,
  VendorMasterFormPage,
  VendorLocationMasterListPage,
  VendorLocationMasterFormPage,
  ItemSubgroupMasterListPage,
  ItemSubgroupMasterFormPage,
  CostCenterMasterListPage,
  CostCenterMasterFormPage,
  CountryMasterListPage,
  CountryMasterFormPage,
  StateMasterListPage,
  StateMasterFormPage,
  CityMasterListPage,
  CityMasterFormPage,
  CurrencyMasterListPage,
  CurrencyMasterFormPage,
  PriorityMasterListPage,
  PriorityMasterFormPage,
  CSReasonMasterListPage,
  CSReasonMasterFormPage,
  RegionMasterListPage,
  RegionMasterFormPage,
  UnitMasterListPage,
  UnitMasterFormPage,
  MakeMasterListPage,
  MakeMasterFormPage,
  BusinessTypeMasterListPage,
  BusinessTypeMasterFormPage,
  FinancialYearMasterListPage,
  FinancialYearMasterFormPage,
  VendorCategoryMasterListPage,
  VendorCategoryMasterFormPage,
  TermsAndConditionsGroupMasterListPage,
  TermsAndConditionsGroupMasterFormPage,
  TermsAndConditionsHeadMasterListPage,
  TermsAndConditionsHeadMasterFormPage,
  VendorAttachmentMasterListPage,
  VendorAttachmentMasterFormPage,
} from '../pages';

type AppFixtures = {
  loginPage: LoginPage;
  purchaseRequestListPage: PurchaseRequestListPage;
  purchaseRequestFormPage: PurchaseRequestFormPage;
  purchaseRequestDisplayPage: PurchaseRequestDisplayPage;
  purchaseOrderListPage: PurchaseOrderListPage;
  purchaseOrderFormPage: PurchaseOrderFormPage;
  purchaseOrderDisplayPage: PurchaseOrderDisplayPage;
  requestForQuotationListPage: RequestForQuotationListPage;
  requestForQuotationFormPage: RequestForQuotationFormPage;
  requestForQuotationDisplayPage: RequestForQuotationDisplayPage;
  approvalSetupMasterListPage: ApprovalSetupMasterListPage;
  approvalSetupMasterFormPage: ApprovalSetupMasterFormPage;
  approvalSetupMasterDisplayPage: ApprovalSetupMasterDisplayPage;
  itemMasterListPage: ItemMasterListPage;
  itemMasterFormPage: ItemMasterFormPage;
  warehouseMasterListPage: WarehouseMasterListPage;
  warehouseMasterFormPage: WarehouseMasterFormPage;
  announcementMasterListPage: AnnouncementMasterListPage;
  announcementMasterFormPage: AnnouncementMasterFormPage;
  itemCategoryMasterListPage: ItemCategoryMasterListPage;
  itemCategoryMasterFormPage: ItemCategoryMasterFormPage;
  itemGroupMasterListPage: ItemGroupMasterListPage;
  itemGroupMasterFormPage: ItemGroupMasterFormPage;
  informToGroupMasterListPage: InformToGroupMasterListPage;
  informToGroupMasterFormPage: InformToGroupMasterFormPage;
  locationMasterListPage: LocationMasterListPage;
  locationMasterFormPage: LocationMasterFormPage;
  companyMasterListPage: CompanyMasterListPage;
  companyMasterFormPage: CompanyMasterFormPage;
  companyLocationMasterListPage: CompanyLocationMasterListPage;
  companyLocationMasterFormPage: CompanyLocationMasterFormPage;
  departmentMasterListPage: DepartmentMasterListPage;
  departmentMasterFormPage: DepartmentMasterFormPage;
  divisionMasterListPage: DivisionMasterListPage;
  divisionMasterFormPage: DivisionMasterFormPage;
  docTypeMasterListPage: DocTypeMasterListPage;
  docTypeMasterFormPage: DocTypeMasterFormPage;
  vendorRegistrationListPage: VendorRegistrationListPage;
  vendorRegistrationFormPage: VendorRegistrationFormPage;
  vendorMasterListPage: VendorMasterListPage;
  vendorMasterFormPage: VendorMasterFormPage;
  vendorLocationMasterListPage: VendorLocationMasterListPage;
  vendorLocationMasterFormPage: VendorLocationMasterFormPage;
  itemSubgroupMasterListPage: ItemSubgroupMasterListPage;
  itemSubgroupMasterFormPage: ItemSubgroupMasterFormPage;
  costCenterMasterListPage: CostCenterMasterListPage;
  costCenterMasterFormPage: CostCenterMasterFormPage;
  countryMasterListPage: CountryMasterListPage;
  countryMasterFormPage: CountryMasterFormPage;
  stateMasterListPage: StateMasterListPage;
  stateMasterFormPage: StateMasterFormPage;
  cityMasterListPage: CityMasterListPage;
  cityMasterFormPage: CityMasterFormPage;
  currencyMasterListPage: CurrencyMasterListPage;
  currencyMasterFormPage: CurrencyMasterFormPage;
  priorityMasterListPage: PriorityMasterListPage;
  priorityMasterFormPage: PriorityMasterFormPage;
  csReasonMasterListPage: CSReasonMasterListPage;
  csReasonMasterFormPage: CSReasonMasterFormPage;
  regionMasterListPage: RegionMasterListPage;
  regionMasterFormPage: RegionMasterFormPage;
  unitMasterListPage: UnitMasterListPage;
  unitMasterFormPage: UnitMasterFormPage;
  makeMasterListPage: MakeMasterListPage;
  makeMasterFormPage: MakeMasterFormPage;
  businessTypeMasterListPage: BusinessTypeMasterListPage;
  businessTypeMasterFormPage: BusinessTypeMasterFormPage;
  financialYearMasterListPage: FinancialYearMasterListPage;
  financialYearMasterFormPage: FinancialYearMasterFormPage;
  vendorCategoryMasterListPage: VendorCategoryMasterListPage;
  vendorCategoryMasterFormPage: VendorCategoryMasterFormPage;
  termsAndConditionsGroupMasterListPage: TermsAndConditionsGroupMasterListPage;
  termsAndConditionsGroupMasterFormPage: TermsAndConditionsGroupMasterFormPage;
  termsAndConditionsHeadMasterListPage: TermsAndConditionsHeadMasterListPage;
  termsAndConditionsHeadMasterFormPage: TermsAndConditionsHeadMasterFormPage;
  vendorAttachmentMasterListPage: VendorAttachmentMasterListPage;
  vendorAttachmentMasterFormPage: VendorAttachmentMasterFormPage;
};

export const test = base.extend<AppFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  purchaseRequestListPage: async ({ page }, use) => {
    await use(new PurchaseRequestListPage(page));
  },
  purchaseRequestFormPage: async ({ page }, use) => {
    await use(new PurchaseRequestFormPage(page));
  },
  purchaseRequestDisplayPage: async ({ page }, use) => {
    await use(new PurchaseRequestDisplayPage(page));
  },
  purchaseOrderListPage: async ({ page }, use) => {
    await use(new PurchaseOrderListPage(page));
  },
  purchaseOrderFormPage: async ({ page }, use) => {
    await use(new PurchaseOrderFormPage(page));
  },
  purchaseOrderDisplayPage: async ({ page }, use) => {
    await use(new PurchaseOrderDisplayPage(page));
  },
  requestForQuotationListPage: async ({ page }, use) => {
    await use(new RequestForQuotationListPage(page));
  },
  requestForQuotationFormPage: async ({ page }, use) => {
    await use(new RequestForQuotationFormPage(page));
  },
  requestForQuotationDisplayPage: async ({ page }, use) => {
    await use(new RequestForQuotationDisplayPage(page));
  },
  approvalSetupMasterListPage: async ({ page }, use) => {
    await use(new ApprovalSetupMasterListPage(page));
  },
  approvalSetupMasterFormPage: async ({ page }, use) => {
    await use(new ApprovalSetupMasterFormPage(page));
  },
  approvalSetupMasterDisplayPage: async ({ page }, use) => {
    await use(new ApprovalSetupMasterDisplayPage(page));
  },
  itemMasterListPage: async ({ page }, use) => {
    await use(new ItemMasterListPage(page));
  },
  itemMasterFormPage: async ({ page }, use) => {
    await use(new ItemMasterFormPage(page));
  },
  warehouseMasterListPage: async ({ page }, use) => {
    await use(new WarehouseMasterListPage(page));
  },
  warehouseMasterFormPage: async ({ page }, use) => {
    await use(new WarehouseMasterFormPage(page));
  },
  announcementMasterListPage: async ({ page }, use) => {
    await use(new AnnouncementMasterListPage(page));
  },
  announcementMasterFormPage: async ({ page }, use) => {
    await use(new AnnouncementMasterFormPage(page));
  },
  itemCategoryMasterListPage: async ({ page }, use) => {
    await use(new ItemCategoryMasterListPage(page));
  },
  itemCategoryMasterFormPage: async ({ page }, use) => {
    await use(new ItemCategoryMasterFormPage(page));
  },
  itemGroupMasterListPage: async ({ page }, use) => {
    await use(new ItemGroupMasterListPage(page));
  },
  itemGroupMasterFormPage: async ({ page }, use) => {
    await use(new ItemGroupMasterFormPage(page));
  },
  informToGroupMasterListPage: async ({ page }, use) => {
    await use(new InformToGroupMasterListPage(page));
  },
  informToGroupMasterFormPage: async ({ page }, use) => {
    await use(new InformToGroupMasterFormPage(page));
  },
  locationMasterListPage: async ({ page }, use) => {
    await use(new LocationMasterListPage(page));
  },
  locationMasterFormPage: async ({ page }, use) => {
    await use(new LocationMasterFormPage(page));
  },
  companyMasterListPage: async ({ page }, use) => {
    await use(new CompanyMasterListPage(page));
  },
  companyMasterFormPage: async ({ page }, use) => {
    await use(new CompanyMasterFormPage(page));
  },
  companyLocationMasterListPage: async ({ page }, use) => {
    await use(new CompanyLocationMasterListPage(page));
  },
  companyLocationMasterFormPage: async ({ page }, use) => {
    await use(new CompanyLocationMasterFormPage(page));
  },
  departmentMasterListPage: async ({ page }, use) => {
    await use(new DepartmentMasterListPage(page));
  },
  departmentMasterFormPage: async ({ page }, use) => {
    await use(new DepartmentMasterFormPage(page));
  },
  divisionMasterListPage: async ({ page }, use) => {
    await use(new DivisionMasterListPage(page));
  },
  divisionMasterFormPage: async ({ page }, use) => {
    await use(new DivisionMasterFormPage(page));
  },
  docTypeMasterListPage: async ({ page }, use) => {
    await use(new DocTypeMasterListPage(page));
  },
  docTypeMasterFormPage: async ({ page }, use) => {
    await use(new DocTypeMasterFormPage(page));
  },
  vendorRegistrationListPage: async ({ page }, use) => {
    await use(new VendorRegistrationListPage(page));
  },
  vendorRegistrationFormPage: async ({ page }, use) => {
    await use(new VendorRegistrationFormPage(page));
  },
  vendorMasterListPage: async ({ page }, use) => {
    await use(new VendorMasterListPage(page));
  },
  vendorMasterFormPage: async ({ page }, use) => {
    await use(new VendorMasterFormPage(page));
  },
  vendorLocationMasterListPage: async ({ page }, use) => {
    await use(new VendorLocationMasterListPage(page));
  },
  vendorLocationMasterFormPage: async ({ page }, use) => {
    await use(new VendorLocationMasterFormPage(page));
  },
  itemSubgroupMasterListPage: async ({ page }, use) => {
    await use(new ItemSubgroupMasterListPage(page));
  },
  itemSubgroupMasterFormPage: async ({ page }, use) => {
    await use(new ItemSubgroupMasterFormPage(page));
  },
  costCenterMasterListPage: async ({ page }, use) => {
    await use(new CostCenterMasterListPage(page));
  },
  costCenterMasterFormPage: async ({ page }, use) => {
    await use(new CostCenterMasterFormPage(page));
  },
  countryMasterListPage: async ({ page }, use) => {
    await use(new CountryMasterListPage(page));
  },
  countryMasterFormPage: async ({ page }, use) => {
    await use(new CountryMasterFormPage(page));
  },
  stateMasterListPage: async ({ page }, use) => {
    await use(new StateMasterListPage(page));
  },
  stateMasterFormPage: async ({ page }, use) => {
    await use(new StateMasterFormPage(page));
  },
  cityMasterListPage: async ({ page }, use) => {
    await use(new CityMasterListPage(page));
  },
  cityMasterFormPage: async ({ page }, use) => {
    await use(new CityMasterFormPage(page));
  },
  currencyMasterListPage: async ({ page }, use) => {
    await use(new CurrencyMasterListPage(page));
  },
  currencyMasterFormPage: async ({ page }, use) => {
    await use(new CurrencyMasterFormPage(page));
  },
  priorityMasterListPage: async ({ page }, use) => {
    await use(new PriorityMasterListPage(page));
  },
  priorityMasterFormPage: async ({ page }, use) => {
    await use(new PriorityMasterFormPage(page));
  },
  csReasonMasterListPage: async ({ page }, use) => {
    await use(new CSReasonMasterListPage(page));
  },
  csReasonMasterFormPage: async ({ page }, use) => {
    await use(new CSReasonMasterFormPage(page));
  },
  regionMasterListPage: async ({ page }, use) => {
    await use(new RegionMasterListPage(page));
  },
  regionMasterFormPage: async ({ page }, use) => {
    await use(new RegionMasterFormPage(page));
  },
  unitMasterListPage: async ({ page }, use) => {
    await use(new UnitMasterListPage(page));
  },
  unitMasterFormPage: async ({ page }, use) => {
    await use(new UnitMasterFormPage(page));
  },
  makeMasterListPage: async ({ page }, use) => {
    await use(new MakeMasterListPage(page));
  },
  makeMasterFormPage: async ({ page }, use) => {
    await use(new MakeMasterFormPage(page));
  },
  businessTypeMasterListPage: async ({ page }, use) => {
    await use(new BusinessTypeMasterListPage(page));
  },
  businessTypeMasterFormPage: async ({ page }, use) => {
    await use(new BusinessTypeMasterFormPage(page));
  },
  financialYearMasterListPage: async ({ page }, use) => {
    await use(new FinancialYearMasterListPage(page));
  },
  financialYearMasterFormPage: async ({ page }, use) => {
    await use(new FinancialYearMasterFormPage(page));
  },
  vendorCategoryMasterListPage: async ({ page }, use) => {
    await use(new VendorCategoryMasterListPage(page));
  },
  vendorCategoryMasterFormPage: async ({ page }, use) => {
    await use(new VendorCategoryMasterFormPage(page));
  },
  termsAndConditionsGroupMasterListPage: async ({ page }, use) => {
    await use(new TermsAndConditionsGroupMasterListPage(page));
  },
  termsAndConditionsGroupMasterFormPage: async ({ page }, use) => {
    await use(new TermsAndConditionsGroupMasterFormPage(page));
  },
  termsAndConditionsHeadMasterListPage: async ({ page }, use) => {
    await use(new TermsAndConditionsHeadMasterListPage(page));
  },
  termsAndConditionsHeadMasterFormPage: async ({ page }, use) => {
    await use(new TermsAndConditionsHeadMasterFormPage(page));
  },
  vendorAttachmentMasterListPage: async ({ page }, use) => {
    await use(new VendorAttachmentMasterListPage(page));
  },
  vendorAttachmentMasterFormPage: async ({ page }, use) => {
    await use(new VendorAttachmentMasterFormPage(page));
  },
});

export { expect } from '@playwright/test';
