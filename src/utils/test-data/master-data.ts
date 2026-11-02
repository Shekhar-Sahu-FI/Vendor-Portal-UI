export enum DocumentStatus {
  Draft = 1,
  Pending = 2,
  Authorized = 3,
  Rejected = 4,
  Cancelled = 5,
}

export enum RefDocType {
  DirectRFQ = 1,
  PR = 2,
}

export const unitData = [
  {
    statusId: 1,
    statusRemarks: '',
    unitName: 'Unit One',
    alias: 'UONE',
  },
  {
    statusId: 1,
    statusRemarks: '',
    unitName: 'Unit Two',
    alias: 'UTWO',
  },
  {
    statusId: 1,
    statusRemarks: '',
    unitName: 'Unit Three',
    alias: 'UTHR',
  },
  {
    statusId: 1,
    statusRemarks: '',
    unitName: 'Unit Four',
    alias: 'UFOR',
  },
  {
    statusId: 1,
    statusRemarks: '',
    unitName: 'Unit Five',
    alias: 'UFIV',
  },
  {
    statusId: 1,
    statusRemarks: '',
    unitName: 'Unit Six',
    alias: 'USIX',
  },
  {
    statusId: 1,
    statusRemarks: '',
    unitName: 'Unit Seven',
    alias: 'USEV',
  },
  {
    statusId: 2,
    statusRemarks: 'inactive unit',
    unitName: 'inactive',
    alias: 'inc',
  },
];

export const categoryData = [
  {
    statusId: 1,
    statusRemarks: '',
    code: 'C0',
    categoryName: 'Category One',
  },
  {
    statusId: 1,
    statusRemarks: '',
    code: 'C2',
    categoryName: 'Category Two',
  },
  {
    statusId: 1,
    statusRemarks: '',
    code: 'C3',
    categoryName: 'Category Three',
  },
  {
    statusId: 1,
    statusRemarks: '',
    code: 'C4',
    categoryName: 'Category Four',
  },
  {
    statusId: 1,
    statusRemarks: '',
    code: 'C5',
    categoryName: 'Category Five',
  },
  {
    statusId: 1,
    statusRemarks: '',
    code: 'C6',
    categoryName: 'Category Six',
  },
  {
    statusId: 1,
    statusRemarks: '',
    code: 'C7',
    categoryName: 'Category Seven',
  },
  {
    statusId: 2,
    statusRemarks: 'inactive',
    code: 'C8',
    categoryName: 'Inactive',
  },
];

export const groupData = [
  {
    statusId: 1,
    statusRemarks: '',
    code: 'G1',
    groupCode: 'G1',
    groupName: 'Group One One',
    categoryName: 'Category One',
  },
  {
    statusId: 1,
    statusRemarks: '',
    code: 'G2',
    groupCode: 'G2',
    groupName: 'Group One Two',
    categoryName: 'Category Two',
  },
  {
    statusId: 1,
    statusRemarks: '',
    code: 'G3',
    groupCode: 'G3',
    groupName: 'Group Two One',
    categoryName: 'Category One',
  },
  {
    statusId: 1,
    statusRemarks: '',
    code: 'G4',
    groupCode: 'G4',
    groupName: 'Group Two Two',
    categoryName: 'Category Two',
  },
  {
    statusId: 1,
    statusRemarks: '',
    code: 'G5',
    groupCode: 'G5',
    groupName: 'Group Three One',
    categoryName: 'Category One',
  },
  {
    statusId: 1,
    statusRemarks: '',
    code: 'G6',
    groupCode: 'G6',
    groupName: 'Group Three Two',
    categoryName: 'Category Two',
  },
  {
    statusId: 1,
    statusRemarks: '',
    code: 'G7',
    groupCode: 'G7',
    groupName: 'Group Four One',
    categoryName: 'Category One',
  },
  {
    statusId: 1,
    statusRemarks: '',
    code: 'G8',
    groupCode: 'G8',
    groupName: 'Group Four Two',
    categoryName: 'Category Two',
  },
  {
    statusId: 1,
    statusRemarks: '',
    code: 'G9',
    groupCode: 'G9',
    groupName: 'Group Five One',
    categoryName: 'Category One',
  },
  {
    statusId: 1,
    statusRemarks: '',
    code: 'GA',
    groupCode: 'GA',
    groupName: 'Group Five Two',
    categoryName: 'Category Two',
  },
  {
    statusId: 1,
    statusRemarks: '',
    code: 'GB',
    groupCode: 'GB',
    groupName: 'Group Six One',
    categoryName: 'Category One',
  },
  {
    statusId: 1,
    statusRemarks: '',
    code: 'GC',
    groupCode: 'GC',
    groupName: 'Group Six Two',
    categoryName: 'Category Two',
  },
  {
    statusId: 1,
    statusRemarks: '',
    code: 'GG',
    groupCode: 'GG',
    groupName: 'Group Seven One',
    categoryName: 'Category One',
  },
  {
    statusId: 1,
    statusRemarks: '',
    code: 'GD',
    groupCode: 'GD',
    groupName: 'Group Seven Two',
    categoryName: 'Category Two',
  },
  {
    statusId: 2,
    statusRemarks: 'inactive',
    code: 'GF',
    groupCode: 'GF',
    groupName: 'Group Eight Two',
    categoryName: 'Category Two',
  },
];

export const subgroupData = [
  {
    statusId: 1,
    statusRemarks: '',
    code: 'S1',
    subgroupCode: 'S1',
    subgroupName: 'Subgroup One One',
    hsnSacCode: '7208',
    groupName: 'Group One',
    unitName: 'Unit One',
    gstCategoryId: 1,
  },
  {
    statusId: 1,
    statusRemarks: '',
    code: 'S2',
    subgroupCode: 'S2',
    subgroupName: 'Subgroup One Two',
    hsnSacCode: '7209',
    groupName: 'Group Two',
    unitName: 'Unit Two',
    gstCategoryId: 2,
  },
  {
    statusId: 1,
    statusRemarks: '',
    code: 'S3',
    subgroupCode: 'S3',
    subgroupName: 'Subgroup Two One',
    hsnSacCode: '7210',
    groupName: 'Group One',
    unitName: 'Unit Three',
    gstCategoryId: 3,
  },
  {
    statusId: 1,
    statusRemarks: '',
    code: 'S4',
    subgroupCode: 'S4',
    subgroupName: 'Subgroup Two Two',
    hsnSacCode: '7211',
    groupName: 'Group Two',
    unitName: 'Unit Four',
    gstCategoryId: 3,
  },
  {
    statusId: 1,
    statusRemarks: '',
    code: 'S5',
    subgroupCode: 'S5',
    subgroupName: 'Subgroup Three One',
    hsnSacCode: '7212',
    groupName: 'Group One',
    unitName: 'Unit Five',
    gstCategoryId: 2,
  },
  {
    statusId: 1,
    statusRemarks: '',
    code: 'S6',
    subgroupCode: 'S6',
    subgroupName: 'Subgroup Three Two',
    hsnSacCode: '7213',
    groupName: 'Group Two',
    unitName: 'Unit Six',
    gstCategoryId: 2,
  },
  {
    statusId: 1,
    statusRemarks: '',
    code: 'S7',
    subgroupCode: 'S7',
    subgroupName: 'Subgroup Four One',
    hsnSacCode: '7214',
    groupName: 'Group One',
    unitName: 'Unit Seven',
    gstCategoryId: 1,
  },
  {
    statusId: 1,
    statusRemarks: '',
    code: 'S8',
    subgroupCode: 'S8',
    subgroupName: 'Subgroup Four Two',
    hsnSacCode: '7215',
    groupName: 'Group Two',
    unitName: 'Unit One',
    gstCategoryId: 1,
  },
];

export const makeData = [
  {
    statusId: 1,
    statusRemarks: '',
    makeName: 'Make One',
    alias: 'MONE',
  },
  {
    statusId: 1,
    statusRemarks: '',
    makeName: 'Make Two',
    alias: 'MTWO',
  },
  {
    statusId: 1,
    statusRemarks: '',
    makeName: 'Make Three',
    alias: 'MTHR',
  },
  {
    statusId: 1,
    statusRemarks: '',
    makeName: 'Make Four',
    alias: 'MFOR',
  },
  {
    statusId: 1,
    statusRemarks: '',
    makeName: 'Make Five',
    alias: 'MFIV',
  },
  {
    statusId: 1,
    statusRemarks: '',
    makeName: 'Make Six',
    alias: 'MSIX',
  },
  {
    statusId: 1,
    statusRemarks: '',
    makeName: 'Make Seven',
    alias: 'MSEV',
  },
  {
    statusId: 2,
    statusRemarks: 'inactive Make',
    makeName: 'inactive',
    alias: 'inc',
  },
];

export const businessTypeData = [
  {
    statusId: 1,
    statusRemarks: '',
    businessTypeName: 'Business Type One',
  },
  {
    statusId: 1,
    statusRemarks: '',
    businessTypeName: 'Business Type Two',
  },
  {
    statusId: 1,
    statusRemarks: '',
    businessTypeName: 'Business Type Three',
  },
  {
    statusId: 1,
    statusRemarks: '',
    businessTypeName: 'Business Type Four',
  },
  {
    statusId: 1,
    statusRemarks: '',
    businessTypeName: 'Business Type Five',
  },
  {
    statusId: 1,
    statusRemarks: '',
    businessTypeName: 'Business Type Six',
  },
  {
    statusId: 1,
    statusRemarks: '',
    businessTypeName: 'Business Type Seven',
  },
  {
    statusId: 2,
    statusRemarks: 'sadasd',
    businessTypeName: 'inactive',
  },
];

export const currencyData = [
  {
    statusId: 1,
    statusRemarks: '',
    currencyName: 'Indian Rupee',
    currencyNotation: 'INR',
    currencySymbol: '₹',
    subunitName: 'Paise',
  },
  {
    statusId: 1,
    statusRemarks: '',
    currencyName: 'US Dollar',
    currencyNotation: 'USD',
    currencySymbol: '$',
    subunitName: 'Cent',
  },
  {
    statusId: 1,
    statusRemarks: '',
    currencyName: 'Euro',
    currencyNotation: 'EUR',
    currencySymbol: '€',
    subunitName: 'Cent',
  },
  {
    statusId: 1,
    statusRemarks: '',
    currencyName: 'British Pound',
    currencyNotation: 'GBP',
    currencySymbol: '£',
    subunitName: 'Penny',
  },
  {
    statusId: 1,
    statusRemarks: '',
    currencyName: 'Japanese Yen',
    currencyNotation: 'JPY',
    currencySymbol: '¥',
    subunitName: 'Sen',
  },
];

export const cSReasonData = [
  {
    statusId: 1,
    statusRemarks: '',
    reasonName: 'CS Reason One',
  },
  {
    statusId: 1,
    statusRemarks: '',
    reasonName: 'CS Reason Two',
  },
  {
    statusId: 1,
    statusRemarks: '',
    reasonName: 'CS Reason Three',
  },
  {
    statusId: 1,
    statusRemarks: '',
    reasonName: 'CS Reason Four',
  },
  {
    statusId: 1,
    statusRemarks: '',
    reasonName: 'CS Reason Five',
  },
  {
    statusId: 1,
    statusRemarks: '',
    reasonName: 'CS Reason Six',
  },
  {
    statusId: 1,
    statusRemarks: '',
    reasonName: 'CS Reason Seven',
  },
  {
    statusId: 2,
    statusRemarks: 'inactive',
    reasonName: 'inactive',
  },
];

export const regionData = [
  {
    statusId: 1,
    statusRemarks: '',
    regionName: 'North Region',
  },
  {
    statusId: 1,
    statusRemarks: '',
    regionName: 'South Region',
  },
  {
    statusId: 1,
    statusRemarks: '',
    regionName: 'East Region',
  },
  {
    statusId: 1,
    statusRemarks: '',
    regionName: 'West Region',
  },
  {
    statusId: 1,
    statusRemarks: '',
    regionName: 'Central Region',
  },
  {
    statusId: 1,
    statusRemarks: '',
    regionName: 'North-East Region',
  },
  {
    statusId: 1,
    statusRemarks: '',
    regionName: 'International Region',
  },
  {
    statusId: 2,
    statusRemarks: 'Inactive region',
    regionName: 'Special Economic Zone Region',
  },
];

export const tNCHeadData = [
  {
    statusId: 1,
    statusRemarks: '',
    tncHeadName: 'Head One is Compulsory Not Default',
    isCompulsory: true,
    isDefault: false,
  },
  {
    statusId: 1,
    statusRemarks: '',
    tncHeadName: 'Head Two is Default Not Compulsory',
    isCompulsory: true,
    isDefault: true,
  },
  {
    statusId: 1,
    statusRemarks: '',
    tncHeadName: 'Head Three is Compulsory and Default',
    isCompulsory: true,
    isDefault: true,
  },
  {
    statusId: 1,
    statusRemarks: '',
    tncHeadName: 'Head Four is Optional',
    isCompulsory: false,
    isDefault: false,
  },
  {
    statusId: 1,
    statusRemarks: '',
    tncHeadName: 'Head Five is Compulsory Not Default',
    isCompulsory: true,
    isDefault: false,
  },
  {
    statusId: 1,
    statusRemarks: '',
    tncHeadName: 'Head Six is Default Not Compulsory',
    isCompulsory: true,
    isDefault: true,
  },
  {
    statusId: 1,
    statusRemarks: '',
    tncHeadName: 'Head Seven is Optional',
    isCompulsory: false,
    isDefault: false,
  },
];

export const tNCGroupData = [
  {
    statusId: 1,
    statusRemarks: '',
    tncGroupName: 'TNC Group One',
    tncGroupHeadDetail: [
      {
        tncHeadName: 'Head One',
        tncValue: '100% payment within 30 days from invoice date.',
      },
      {
        tncHeadName: 'Head Three',
        tncValue: 'FOB Destination.',
      },
    ],
    isRfqDefault: true,
    isPoDefault: false,
  },
  {
    statusId: 1,
    statusRemarks: '',
    tncGroupName: 'TNC Group Two',
    tncGroupHeadDetail: [
      {
        tncHeadName: 'Head Two',
        tncValue: 'Goods must be delivered within 15 business days.',
      },
      {
        tncHeadName: 'Head Four',
        tncValue: 'Warranty period shall be 12 months.',
      },
    ],
    isRfqDefault: false,
    isPoDefault: true,
  },
];

export const vendorCategoryData = [
  {
    statusId: 1,
    statusRemarks: '',
    vendorCategoryName: 'Category One',
  },
  {
    statusId: 1,
    statusRemarks: '',
    vendorCategoryName: 'Category Two',
  },
  {
    statusId: 1,
    statusRemarks: '',
    vendorCategoryName: 'Category Three',
  },
  {
    statusId: 1,
    statusRemarks: '',
    vendorCategoryName: 'Category Four',
  },
  {
    statusId: 1,
    statusRemarks: '',
    vendorCategoryName: 'Category Five',
  },
  {
    statusId: 1,
    statusRemarks: '',
    vendorCategoryName: 'Category Six',
  },
  {
    statusId: 1,
    statusRemarks: '',
    vendorCategoryName: 'Category Seven',
  },
  {
    statusId: 2,
    statusRemarks: 'inactive',
    vendorCategoryName: 'inactive',
  },
];

export const priorityData = [
  {
    statusId: 1,
    statusRemarks: '',
    priorityName: 'Priority One',
  },
  {
    statusId: 1,
    statusRemarks: '',
    priorityName: 'Priority Two',
  },
  {
    statusId: 1,
    statusRemarks: '',
    priorityName: 'Priority Three',
  },
  {
    statusId: 1,
    statusRemarks: '',
    priorityName: 'Priority Four',
  },
  {
    statusId: 1,
    statusRemarks: '',
    priorityName: 'Priority Five',
  },
  {
    statusId: 1,
    statusRemarks: '',
    priorityName: 'Priority Six',
  },
  {
    statusId: 1,
    statusRemarks: '',
    priorityName: 'Priority Seven',
  },
  {
    statusId: 2,
    statusRemarks: 'inactive',
    priorityName: 'inactive',
  },
];

export const itemData = [
  {
    statusId: 1,
    statusRemarks: '',
    itemName: 'Item One No Multi Unit No Make',
    code: 'IT01',
    itemCode: 'CPC1',
    unitName: 'Unit One',
    gstCategoryId: 1,
    subgroupName: 'Subgroup One One',
    hsnSacCode: '7208',
    makeMgmtTypeId: 1,
    remarks: '',
    unitConversionDetail: [],
    itemSelectedMakeDetail: [],
  },
  {
    statusId: 1,
    statusRemarks: '',
    itemName: 'Item Two Multi Unit Make One Two Three',
    code: 'IT02',
    itemCode: 'CPC2',
    unitName: 'Unit One',
    gstCategoryId: 2,
    subgroupName: 'Subgroup One Two',
    hsnSacCode: '7209',
    makeMgmtTypeId: 2,
    remarks: '',
    unitConversionDetail: [
      {
        unitTypeId: 1,
        unitConversionTypeId: 1,
        fromUnitValue: 1,
        tounitName: 'Unit Two',
        toUnitValue: 1,
      },
    ],
    itemSelectedMakeDetail: [
      { makeName: 'Make One' },
      { makeName: 'Make Two' },
      { makeName: 'Make Three' },
    ],
  },
  {
    statusId: 1,
    statusRemarks: '',
    itemName: 'Item Three No Multi Unit All Make',
    code: 'IT03',
    itemCode: 'CPC3',
    unitName: 'Unit Two',
    gstCategoryId: 3,
    subgroupName: 'Subgroup Two One',
    hsnSacCode: '7210',
    makeMgmtTypeId: 1,
    remarks: '',
    unitConversionDetail: [],
    itemSelectedMakeDetail: [],
  },
];

export const countryData = [
  {
    statusId: 1,
    statusRemarks: '',
    countryName: 'India',
    isoCountryCode: 'IND',
    phoneCode: '+91',
    pinCodeLength: 6,
    pinCodeFormatId: 1,
    minContactNoLength: 13,
    maxContactNoLength: 13,
  },
  {
    statusId: 1,
    statusRemarks: '',
    countryName: 'United States',
    isoCountryCode: 'US',
    phoneCode: '+1',
    pinCodeLength: 5,
    pinCodeFormatId: 2,
    minContactNoLength: 10,
    maxContactNoLength: 10,
  },
  {
    statusId: 2,
    statusRemarks: 'inactive country',
    countryName: 'inactive',
    isoCountryCode: 'inc',
    phoneCode: '+65',
    pinCodeLength: 6,
    pinCodeFormatId: 1,
    minContactNoLength: 8,
    maxContactNoLength: 8,
  },
];

export const stateData = [
  {
    statusId: 1,
    statusRemarks: '',
    stateName: 'Chhattisgarh',
    countryName: 'India',
    gstStateCode: '22',
    isUnionTerritory: true,
  },
  {
    statusId: 1,
    statusRemarks: '',
    stateName: 'Maharashtra',
    countryName: 'India',
    gstStateCode: '27',
    isUnionTerritory: false,
  },
  {
    statusId: 1,
    statusRemarks: '',
    stateName: 'California',
    countryName: 'United States',
    gstStateCode: '',
    isUnionTerritory: false,
  },
];

export const cityData = [
  {
    statusId: 1,
    statusRemarks: '',
    cityName: 'Raipur',
    stateName: 'Chhattisgarh',
    countryName: 'India',
  },
  {
    statusId: 1,
    statusRemarks: '',
    cityName: 'Mumbai',
    stateName: 'Maharashtra',
    countryName: 'India',
  },
  {
    statusId: 1,
    statusRemarks: '',
    cityName: 'Los Angeles',
    stateName: 'California',
    countryName: 'United States',
  },
];

export const locationData = [
  {
    statusId: 1,
    statusRemarks: '',
    locationName: 'Downtown Warehouse',
    alias: 'LAW1',
    cityName: 'Los Angeles',
  },
  {
    statusId: 1,
    statusRemarks: '',
    locationName: 'Andheri Industrial Estate',
    alias: 'MUM1',
    cityName: 'Mumbai',
  },
  {
    statusId: 1,
    statusRemarks: '',
    locationName: 'Central Logistics Hub',
    alias: 'CLH1',
    cityName: 'Raipur',
  },
];

export const companyData = [
  {
    statusId: 1,
    statusRemarks: '',
    companyName: 'Company One',
    headOfficeId: null,
    alias: 'CONE',
    address1: 'Plot 45 Textile Park',
    address2: 'Zone C',
    address3: 'Behind Grain Market',
    cityName: 'Raipur',
    stateName: 'Chhattisgarh',
    countryName: 'India',
    pincode: '495001',
    email: 'contact@vishalfabtech.com',
    website: 'www.vishalfabtech.com',
    panNo: 'AAECV4321L',
    cinNo: 'U17119CT2019PTC098765',
    gstinNo: '22AAECV4321L1Z9',
    printingName: 'Vishal FabTech',
    corporateOfficeAddress: 'Bilaspur, Chhattisgarh',
    corporateOfficeContactNo: null,
    corporateOfficeContactNoCountryId: null,
    corporateOfficeEmail: 'office@vishalfabtech.com',
    regdOfficeAddress: 'Bilaspur, Chhattisgarh',
    regdOfficeContactNo: null,
    regdOfficeContactNoCountryId: null,
    regdOfficeEmail: 'registered@vishalfabtech.com',
    dbMasterId: null,
    timeZonesId: 1,
    erpCompanyUniqueId: 'ERP101',
    tallyCompanyName: 'Vishal FabTech Pvt Ltd',
    tallyGodownName: 'North Store',
  },
  {
    statusId: 1,
    statusRemarks: '',
    companyName: 'Company Two',
    headOfficeId: null,
    alias: 'CTWO',
    address1: 'Sipcot Industrial Complex',
    address2: 'Perambalur Road',
    address3: 'Block D',
    cityName: 'Mumbai',
    stateName: 'Maharashtra',
    countryName: 'India',
    pincode: '641004',
    email: 'hello@ashwinturbines.com',
    website: 'www.ashwinturbines.com',
    panNo: 'AAGCA8765Q',
    cinNo: 'U29290TN2016PTC456789',
    gstinNo: '33AAGCA8765Q1Z2',
    printingName: 'Ashwin Turbine Components',
    corporateOfficeAddress: 'Coimbatore, Tamil Nadu',
    corporateOfficeContactNo: null,
    corporateOfficeContactNoCountryId: null,
    corporateOfficeEmail: 'corporate@ashwinturbines.com',
    regdOfficeAddress: 'Coimbatore, Tamil Nadu',
    regdOfficeContactNo: null,
    regdOfficeContactNoCountryId: null,
    regdOfficeEmail: 'registered@ashwinturbines.com',
    dbMasterId: null,
    timeZonesId: 1,
    erpCompanyUniqueId: 'ERP102',
    tallyCompanyName: 'Ashwin Turbine Components Pvt Ltd',
    tallyGodownName: 'South Depot',
  },
  {
    statusId: 1,
    statusRemarks: '',
    companyName: 'Company Three',
    headOfficeId: null,
    alias: 'CTHR',
    address1: 'Growth Centre Phase 2',
    address2: 'Kandla Road',
    address3: 'Unit 7',
    cityName: 'Raipur',
    stateName: 'Chhattisgarh',
    countryName: 'India',
    pincode: '370001',
    email: 'info@nirmalpolymers.com',
    website: 'www.nirmalpolymers.com',
    panNo: 'AAHCN3210M',
    cinNo: 'U25200GJ2014PLC321098',
    gstinNo: '24AAHCN3210M1Z6',
    printingName: 'Nirmal Polymers Ltd',
    corporateOfficeAddress: 'Bhuj, Gujarat',
    corporateOfficeContactNo: null,
    corporateOfficeContactNoCountryId: null,
    corporateOfficeEmail: 'corp.office@nirmalpolymers.com',
    regdOfficeAddress: 'Bhuj, Gujarat',
    regdOfficeContactNo: null,
    regdOfficeContactNoCountryId: null,
    regdOfficeEmail: 'regd.office@nirmalpolymers.com',
    dbMasterId: null,
    timeZonesId: 1,
    erpCompanyUniqueId: 'ERP103',
    tallyCompanyName: 'Nirmal Polymers Limited',
    tallyGodownName: 'Coastal Warehouse',
  },
];

export const companyLocationData = [
  {
    statusId: 1,
    statusRemarks: '',
    companyName: 'Company One',
    address1: 'Plant No. 1, Industrial Area',
    address2: 'Sector 5',
    address3: 'Urla',
    cityName: 'Raipur',
    stateName: 'Chhattisgarh',
    countryName: 'India',
    pincode: '492001',
    contactNo: '+919876543211',
    contactNoCountryId: 1,
    isDefault: true,
    erpLocationUniqueId1: 'SISLOC001',
    erpLocationUniqueId2: 'SISPLANT01',
  },
  {
    statusId: 1,
    statusRemarks: '',
    companyName: 'Company Two',
    address1: 'MIDC Phase II',
    address2: 'Andheri East',
    address3: '',
    cityName: 'Mumbai',
    stateName: 'Maharashtra',
    countryName: 'India',
    pincode: '400093',
    contactNo: '+919876543211',
    contactNoCountryId: 1,
    isDefault: true,
    erpLocationUniqueId1: 'MEWLOC001',
    erpLocationUniqueId2: 'MEWHO01',
  },
];

export const divisionData = [
  {
    statusId: 1,
    statusRemarks: '',
    code: 'DIVONE',
    divisionName: 'Division One Company One Two Three',
    companyDetail: [
      { companyName: 'Company One', statusId: 1 },
      { companyName: 'Company Two', statusId: 1 },
      { companyName: 'Company Three', statusId: 1 },
    ],
  },
  {
    statusId: 1,
    statusRemarks: '',
    code: 'DIVTWO',
    divisionName: 'Division Two Company Two Three',
    companyDetail: [
      { companyName: 'Company Two', statusId: 1 },
      { companyName: 'Company Three', statusId: 1 },
    ],
  },
];

export const departmentData = [
  {
    statusId: 1,
    statusRemarks: '',
    code: 'DEPT01',
    departmentName: 'Department One Division One Two Three',
    departmentCompanyDivisionDetail: [
      { companyName: 'Company One', divisionName: 'Division One Company One Two Three' },
      { companyName: 'Company Two', divisionName: 'Division One Company One Two Three' },
      { companyName: 'Company Three', divisionName: 'Division One Company One Two Three' },
    ],
  },
  {
    statusId: 1,
    statusRemarks: '',
    code: 'DEPT02',
    departmentName: 'Department Two Division Two Three',
    departmentCompanyDivisionDetail: [
      { companyName: 'Company Two', divisionName: 'Division Two Company Two Three' },
      { companyName: 'Company Three', divisionName: 'Division Two Company Two Three' },
    ],
  },
];

export const docTypeData = [
  {
    docTypeName: 'PR - Standard - Division One Company One Two Three',
    docTypeAlias: 'PST',
    formName: 'Purchase Request',
    statusId: 1,
    statusRemarks: '',
    companyDetails: [
      { companyName: 'Company One', divisionName: 'Division One Company One Two Three' },
      { companyName: 'Company Two', divisionName: 'Division One Company One Two Three' },
      { companyName: 'Company Three', divisionName: 'Division One Company One Two Three' },
    ],
  },
  {
    docTypeName: 'PO - Standard - Division One Company One Two Three',
    docTypeAlias: 'PSD',
    formName: 'Purchase Order',
    statusId: 1,
    statusRemarks: '',
    companyDetails: [
      { companyName: 'Company One', divisionName: 'Division One Company One Two Three' },
      { companyName: 'Company Two', divisionName: 'Division One Company One Two Three' },
      { companyName: 'Company Three', divisionName: 'Division One Company One Two Three' },
    ],
  },
];

export const costCenterData = [
  {
    statusId: 1,
    statusRemarks: '',
    costCenterName: 'Cost Center One',
    alias: 'CCONE',
    parentCostCenterId: null,
    costCenterCompanyDivisionDetail: [
      { companyName: 'Company One', divisionName: 'Division One Company One Two Three' },
      { companyName: 'Company Two', divisionName: 'Division One Company One Two Three' },
      { companyName: 'Company Three', divisionName: 'Division One Company One Two Three' },
    ],
  },
];

export const roleData = [
  {
    statusId: 1,
    statusRemarks: '',
    roleName: 'Super Administrator',
    formRights: [],
    reportRights: [],
  },
];

export const userData = [
  {
    statusId: 1,
    statusRemarks: '',
    userTypeId: 1,
    supplierAccountId: null,
    username: 'UN1',
    displayName: 'System Administrator',
    countryName: 'India',
    contactNo: '+9876500001',
    contactNoCountryId: 1,
    timeZonesId: 1,
    email: 'admin@shaktiindustrial.com',
    erpUserId: null,
    divisionTypeId: null,
    departmentTypeId: null,
    password: 'QWer12!@',
  },
];

export const supplierAccountData = [
  {
    statusId: 1,
    statusRemarks: '',
    supplierAccountName: 'ABC Suppliers',
    description: 'Raw material and industrial equipment supplier based in Raipur, Chhattisgarh',
    vendorLocationDetail: [
      {
        vendorLocationName: 'Plot 21, Industrial Area',
        vendorName: 'ABC Suppliers',
      },
    ],
  },
];

export const vendorMasterData = [
  {
    vendorName: 'ABC Suppliers',
    legalName: 'ABC Suppliers Pvt Ltd',
    bpTypeId: 1,
    vendorLocationDetail: [
      {
        statusId: 1,
        statusRemarks: '',
        addressLine1: 'Plot 21, Industrial Area',
        addressLine2: 'Urla',
        addressLine3: '',
        email: 'info@abc.com',
        website: 'https://www.shaktiispl.com',
        countryName: 'India',
        stateName: 'Chhattisgarh',
        cityName: 'Raipur',
        pincode: '492001',
        vendorCategoryName: 'Category One',
        panNo: 'AABCS1234K',
        gstRegTypeId: 1,
        gstinNo: '22AABCS1234K1Z5',
        regionId: 1,
        businessTypeId: 1,
        businessDescription: 'Industrial equipment manufacturer',
        msmeTypeId: 1,
        msmeNo: 'UDYAMCG010001234',
        vendorLocationContactPersonDetail: [
          {
            contactPersonName: 'Rajesh Sharma',
            designation: 'Sales Manager',
            email: 'rajesh@shaktiispl.com',
            remarks: 'Primary Contact',
            statusId: 1,
            statusRemarks: '',
          },
        ],
        vendorLocationItemGroupDetail: [
          { itemGroupName: 'Group One One' },
          { itemGroupName: 'Group One Two' },
        ],
        vendorLocationBankDetail: [
          {
            bankName: 'State Bank of India',
            branchName: 'Raipur Industrial Area',
            ifscCode: 'SBIN0001234',
            accountName: 'Shakti Industrial Suppliers Pvt Ltd',
            accountNo: '123456789012',
            bankAccountTypeId: 1,
            swiftCode: 'SBININBBXXX',
          },
        ],
      },
    ],
  },
];

export const expenseHeadData = [
  {
    statusId: 1,
    statusRemarks: '',
    expenseName: 'Expense One',
  },
];

export const vendorAttachmentData = [
  {
    statusId: 1,
    statusRemarks: '',
    documentName: 'GST Registration Certificate',
    maxFileSize: 5000,
    filesSupported: 'pdf,jpg,jpeg,png',
    isMandatory: false,
  },
];

export const documentSeriesData = [
  {
    statusId: 1,
    statusRemarks: '',
    pattern: 'PR-{{YYYY}}-{{MM}}-{{N}}',
    padding: 3,
    frequencyId: 1,
    numberStartFrom: 1,
    effectiveDate: '2026-06-01',
  },
];

export const paymentTermsGroupData = [
  {
    statusId: 1,
    statusRemarks: '',
    paymentTermsGroupName: 'PTG Standard 100% Adv',
    paymentTermDetails: [],
  },
];

export const requestForQuotationData = [
  {
    companyName: 'Company One',
    divisionName: 'Division One Company One Two Three',
    departmentName: 'Department One Division One Two Three',
    docSeriesPattern: 'RFQ/{{FY2}}/{{MMM}}/{{N}}',
    docNoYearly: 'RFQ/27/Aug/_ _ _ _ _ ',
    docDate: '2026-08-23',
    docStatusId: DocumentStatus.Authorized,
    docTypeName: 'RFQ - Standard - Division One Company One Two Three',
    refDocTypeId: RefDocType.DirectRFQ,
    dueDate: '2026-09-30T07:55:00.000Z',
    isPriceList: false,
    mailSubject: 'Request for quotation',
    contactName: 'Shekhar Sahu',
    contactNo: '+919998884774',
    contactNoCountryName: 'India',
    contactEmail: 'tnoypy@mailto.plus',
    remarks: 'This is remarks.',
    tncGroupName: 'TNC Group One',
    approvalSetupId: null,
    attachment: [],
    lastModifiedDate: null,
    rfqItemDetail: [],
    rfqVendorDetail: [],
    rfqTncDetail: [],
  },
];

export const finYearData = [
  {
    statusId: 1,
    statusRemarks: '',
    finYearName: '2026-27',
    alias: 'FY26-27',
    shortAlias: '26-27',
    startDate: '2026-04-01',
    endDate: '2027-03-31',
    previousFinYearId: null,
    nextFinYearId: null,
  },
];

/** Utility builder functions for CRUD tests */
export function buildAnnouncementData(marker: string) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  return {
    type: 'NewsFeed',
    displayTo: 'All',
    title: `Announcement ${marker}`,
    startDate: tomorrow.toISOString().slice(0, 16).replace('T', ' '),
    endDate: nextWeek.toISOString().slice(0, 16).replace('T', ' '),
    status: 'Active',
  };
}

export function buildCategoryData(marker: string) {
  // Code max 2 chars, uppercase alphanumeric
  const shortCode = (marker.slice(-2) || 'XX').toUpperCase();
  return {
    code: shortCode,
    categoryName: `Category ${marker}`,
    status: 'Active',
  };
}

export function buildGroupData(marker: string, categoryName: string = 'Category One') {
  const shortCode = (marker.slice(-2) || 'YY').toUpperCase();
  return {
    category: { query: categoryName.slice(0, 4), value: categoryName },
    code: shortCode,
    groupName: `Group ${marker}`,
    status: 'Active',
  };
}

export function buildInformToGroupData(marker: string, userName: string = 'admin') {
  return {
    informToGroupName: `ITG ${marker}`.slice(0, 50),
    description: `Automated Inform To Group ${marker}`,
    users: [
      {
        userName: { query: userName, value: userName },
      },
    ],
    status: 'Active',
  };
}

export function buildLocationData(marker: string) {
  const alias = (marker.slice(-4) || 'LOC1').toUpperCase();
  return {
    locationName: `Location ${marker}`.slice(0, 50),
    alias,
    status: 'Active',
  };
}

export function buildCompanyData(marker: string) {
  const alias = (marker.slice(-4) || 'CMP1').toUpperCase();
  return {
    companyName: `Company ${marker}`.slice(0, 100),
    alias,
    printingName: `Print ${marker}`.slice(0, 100),
    address1: 'Plot 45 Industrial Area',
    country: { query: 'India', value: 'India' },
    state: { query: 'Chhattisgarh', value: 'Chhattisgarh' },
    city: { query: 'Raipur', value: 'Raipur' },
    pincode: '492001',
    status: 'Active',
  };
}

export function buildCompanyLocationData(marker: string, companyName: string = 'Company One') {
  return {
    company: { query: companyName, value: companyName },
    address1: `Site ${marker} Industrial Area`,
    country: { query: 'India', value: 'India' },
    state: { query: 'Chhattisgarh', value: 'Chhattisgarh' },
    city: { query: 'Raipur', value: 'Raipur' },
    pincode: '492001',
    contactNo: '9876543211',
    isDefault: false,
    status: 'Active',
  };
}

export function buildDepartmentData(marker: string) {
  const code = ('D' + marker.slice(-5)).slice(0, 6).toUpperCase();
  return {
    code,
    departmentName: `Dept ${marker}`.slice(0, 100),
    status: 'Active',
  };
}

export function buildDivisionData(marker: string) {
  const code = ('DIV' + marker.slice(-4)).slice(0, 10).toUpperCase();
  return {
    code,
    divisionName: `Division ${marker}`.slice(0, 100),
    status: 'Active',
  };
}

export function buildDocTypeData(marker: string, formName: string = 'Purchase Request') {
  const alias = (marker.slice(-3) || 'DOC').toUpperCase();
  return {
    docTypeName: `Doc Type ${marker}`.slice(0, 100),
    docTypeAlias: alias,
    form: { query: formName, value: formName },
    status: 'Active',
  };
}

export function buildVendorRegistrationData(marker: string) {
  return {
    vendorName: `Vendor ${marker}`.slice(0, 100),
    legalName: `Vendor ${marker} Pvt Ltd`.slice(0, 100),
    address1: 'Plot 10 Industrial Complex',
    country: { query: 'India', value: 'India' },
    state: { query: 'Chhattisgarh', value: 'Chhattisgarh' },
    city: { query: 'Raipur', value: 'Raipur' },
    pincode: '492001',
    email: `vendor_${marker}@test.com`,
    panNo: 'AABCS1234K',
    contactPersonName: 'Rajesh Sharma',
    contactNo: '9876543210',
    bankName: 'State Bank of India',
    branchName: 'Raipur Main',
    accountNo: '123456789012',
    ifscCode: 'SBIN0001234',
  };
}

export function buildWarehouseData(marker: string, locationName: string = 'Central Logistics Hub') {
  return {
    warehouseName: `WH ${marker}`.slice(0, 50),
    location: { query: locationName.slice(0, 7), value: locationName },
    type: 'InHouse',
    ownership: 'Own',
    status: 'Active',
  };
}

export function buildVendorMasterData(marker: string) {
  return {
    vendorName: `Vendor ${marker}`.slice(0, 100),
    legalName: `Vendor ${marker} Pvt Ltd`.slice(0, 100),
    address1: `Plot ${marker.slice(-3)} Industrial Area`,
    country: { query: 'India', value: 'India' },
    state: { query: 'Chhattisgarh', value: 'Chhattisgarh' },
    city: { query: 'Raipur', value: 'Raipur' },
    pincode: '492001',
    email: `vendor_${marker}@test.com`,
    panNo: 'AABCS1234K',
  };
}

export function buildVendorLocationData(marker: string, vendorName: string = 'Vendor One') {
  return {
    vendor: { query: vendorName.slice(0, 6), value: vendorName },
    locationName: `Site ${marker}`.slice(0, 50),
    address1: `Plot ${marker.slice(-3)} Tech Park`,
    country: { query: 'India', value: 'India' },
    state: { query: 'Chhattisgarh', value: 'Chhattisgarh' },
    city: { query: 'Raipur', value: 'Raipur' },
    pincode: '492001',
    status: 'Active',
  };
}

export function buildSubgroupData(marker: string, groupName: string = 'Group One One', unitName: string = 'Unit One') {
  const shortCode = (marker.slice(-2) || 'SG').toUpperCase();
  return {
    group: { query: groupName.slice(0, 5), value: groupName },
    code: shortCode,
    subgroupName: `Subgroup ${marker}`.slice(0, 100),
    stockUnit: { query: unitName.slice(0, 4), value: unitName },
    gstCategoryId: '1',
    hsnSacCode: '7208',
    status: 'Active',
  };
}

export function buildCostCenterData(marker: string) {
  const alias = (marker.slice(-4) || 'CC1').toUpperCase();
  return {
    alias,
    costCenterName: `CC ${marker}`.slice(0, 50),
    status: 'Active',
  };
}

export function buildCountryData(marker: string) {
  const iso = (marker.slice(-3) || 'IND').toUpperCase();
  const phone = `+${marker.slice(-3) || '999'}`.slice(0, 6);
  return {
    countryName: `Country ${marker}`.slice(0, 50),
    isoCountryCode: iso,
    phoneCode: phone,
    pinCodeLength: '6',
    status: 'Active',
  };
}

export function buildStateData(marker: string, countryName: string = 'India') {
  const gstStateCode = marker.slice(-2) || '22';
  return {
    stateName: `State ${marker}`.slice(0, 50),
    country: countryName,
    gstStateCode,
    isUnionTerritory: false,
    status: 'Active',
  };
}

export function buildCityData(marker: string, countryName: string = 'India', stateName: string = 'Chhattisgarh') {
  return {
    cityName: `City ${marker}`.slice(0, 50),
    country: countryName,
    state: stateName,
    status: 'Active',
  };
}

export function buildCurrencyData(marker: string) {
  const notation = (marker.slice(-3) || 'CRN').replace(/[^a-zA-Z]/g, 'X').toUpperCase().slice(0, 3);
  return {
    currencyName: `Currency ${marker}`.slice(0, 100),
    currencyNotation: notation.length === 3 ? notation : 'CRN',
    currencySymbol: '$',
    subunitName: `Cent ${marker.slice(-4)}`,
    status: 'Active',
  };
}

export function buildPriorityData(marker: string) {
  return {
    priorityName: `Priority ${marker}`.slice(0, 100),
    status: 'Active',
  };
}

export function buildCSReasonData(marker: string) {
  return {
    reasonName: `CS Reason ${marker}`.slice(0, 100),
    status: 'Active',
  };
}

export function buildRegionData(marker: string) {
  return {
    regionName: `Region ${marker}`.slice(0, 100),
    status: 'Active',
  };
}

export function buildUnitData(marker: string) {
  const alias = (marker.slice(-4) || 'UNT1').toUpperCase();
  return {
    unitName: `Unit ${marker}`.slice(0, 25),
    alias,
    status: 'Active',
  };
}

export function buildMakeData(marker: string) {
  const alias = (marker.slice(-4) || 'MK1').toUpperCase();
  return {
    makeName: `Make ${marker}`.slice(0, 100),
    alias,
    status: 'Active',
  };
}

export function buildBusinessTypeData(marker: string) {
  return {
    businessTypeName: `BT ${marker}`.slice(0, 100),
    status: 'Active',
  };
}

export function buildFinYearData(marker: string) {
  const yr = marker.slice(-2) || '26';
  const nextYr = String((Number(yr) + 1) % 100).padStart(2, '0');
  return {
    finYearName: `20${yr}-${nextYr}`,
    alias: `FY${yr}-${nextYr}`,
    shortAlias: `${yr}-${nextYr}`,
    startDate: '2026-04-01',
    endDate: '2027-03-31',
    status: 'Active',
  };
}

export function buildVendorCategoryData(marker: string) {
  return {
    vendorCategoryName: `VC ${marker}`.slice(0, 100),
    status: 'Active',
  };
}

export function buildTNCGroupData(marker: string) {
  return {
    tncGroupName: `TNCG ${marker}`.slice(0, 50),
    isRfqDefault: false,
    isPoDefault: false,
    status: 'Active',
  };
}

export function buildTNCHeadData(marker: string) {
  return {
    tncHeadName: `TNCH ${marker}`.slice(0, 100),
    status: 'Active',
  };
}

export function buildVendorAttachmentData(marker: string) {
  return {
    documentName: `Doc ${marker}`.slice(0, 150),
    maxFileSize: '2048',
    isMandatory: 'false',
    status: 'Active',
  };
}


