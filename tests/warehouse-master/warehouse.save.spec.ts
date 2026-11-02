import { test, expect } from "../../src/fixtures/test.fixture";
import { WAREHOUSE_MASTER_ROUTES } from "../../src/pages/warehouse-master/warehouse-master.constants";
import { warehouseExpectUrl } from "../../src/pages/warehouse-master/warehouse-master.assert.messages";

test.describe("Warehouse Master - Save", () => {
  test.beforeEach(async ({ warehouseMasterListPage }) => {
    await warehouseMasterListPage.open();
  });

  test.only("should Save Warehouse with all mandatory fields (WM_SAVE_001)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.saveAndConfirm();
    await expect(
      page,
      warehouseExpectUrl("to redirect to the Warehouse Master list after save"),
    ).toHaveURL(
      new RegExp(
        `\${WAREHOUSE_MASTER_ROUTES.list().replace(/\\//g, '\\\\/')}\$`,
      ),
    );
  });

  test("should Save Warehouse with all fields populated (WM_SAVE_002)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "External",
      ownership: "Party",
      party: { query: "Vendor A", value: "Vendor A" },
      address1: "Line 1",
      address2: "Line 2",
      address3: "Line 3",
      pincode: "123456",
      country: { query: "India", value: "India" },
      state: { query: "Delhi", value: "Delhi" },
      city: { query: "New Delhi", value: "New Delhi" },
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.saveAndConfirm();
    await expect(
      page,
      warehouseExpectUrl("to redirect to the Warehouse Master list after save"),
    ).toHaveURL(
      new RegExp(
        `\${WAREHOUSE_MASTER_ROUTES.list().replace(/\\//g, '\\\\/')}\$`,
      ),
    );
  });

  test("should Save Warehouse with only mandatory fields (WM_SAVE_003)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.saveAndConfirm();
    await expect(
      page,
      warehouseExpectUrl("to redirect to the Warehouse Master list after save"),
    ).toHaveURL(
      new RegExp(
        `\${WAREHOUSE_MASTER_ROUTES.list().replace(/\\//g, '\\\\/')}\$`,
      ),
    );
  });

  test("should Click Save without entering any data (WM_SAVE_004)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {};

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.clickSaveOnly();
    await expect(page.locator("text=Warehouse Name is required")).toBeVisible();
  });

  test("should Save without Warehouse Name (WM_SAVE_005)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.clickSaveOnly();
    await expect(page.locator("text=Warehouse Name is required")).toBeVisible();
  });

  test("should Save without Location (WM_SAVE_006)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      type: "In-house",
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.clickSaveOnly();
    await expect(page.locator("text=Location is required")).toBeVisible();
  });

  test("should Save without Warehouse Type (WM_SAVE_007)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.clickSaveOnly();
    await expect(page.locator("text=Warehouse Type is required")).toBeVisible();
  });

  test("should Save without Status (WM_SAVE_008)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.clickSaveOnly();
    await expect(page.locator("text=Status is required")).toBeVisible();
  });

  test("should Save with Inactive Status but Status Remark blank (WM_SAVE_009)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      status: "Inactive",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.clickSaveOnly();
    await expect(page.locator("text=Status Remarks is required")).toBeVisible();
  });

  test("should Save with Active Status and blank Status Remark (WM_SAVE_010)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      status: "Active",
      statusRemarks: "",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.saveAndConfirm();
    await expect(
      page,
      warehouseExpectUrl("to redirect to the Warehouse Master list after save"),
    ).toHaveURL(
      new RegExp(
        `\${WAREHOUSE_MASTER_ROUTES.list().replace(/\\//g, '\\\\/')}\$`,
      ),
    );
  });

  test("should Save with duplicate Warehouse Name (WM_SAVE_011)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH_DUPLICATE",
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.saveAndConfirm(); // Assume first goes through
    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.clickSaveOnly();
    await expect(page.locator("text=Duplicate validation")).toBeVisible();
  });

  test("should Save with duplicate Warehouse Code (API validation) (WM_SAVE_012)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    // Code is generally auto-generated, but simulating API validation
    await warehouseMasterFormPage.clickSaveOnly();
    await expect(
      page.locator(".z-toast").filter({ hasText: /duplicate code/i }),
    ).toBeVisible();
  });

  test("should Save with Warehouse Name exactly 50 characters (WM_SAVE_013)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "A".repeat(50),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.saveAndConfirm();
    await expect(
      page,
      warehouseExpectUrl("to redirect to the Warehouse Master list after save"),
    ).toHaveURL(
      new RegExp(
        `\${WAREHOUSE_MASTER_ROUTES.list().replace(/\\//g, '\\\\/')}\$`,
      ),
    );
  });

  test("should Save with Warehouse Name exceeding 50 characters (WM_SAVE_014)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "A".repeat(51),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.clickSaveOnly();
    await expect(page.locator("text=Maximum length")).toBeVisible();
  });

  test("should Save with Address Line 1 exactly 100 characters (WM_SAVE_015)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      address1: "A".repeat(100),
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.saveAndConfirm();
    await expect(
      page,
      warehouseExpectUrl("to redirect to the Warehouse Master list after save"),
    ).toHaveURL(
      new RegExp(
        `\${WAREHOUSE_MASTER_ROUTES.list().replace(/\\//g, '\\\\/')}\$`,
      ),
    );
  });

  test("should Save with Address Line 1 exceeding 100 characters (WM_SAVE_016)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      address1: "A".repeat(101),
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.clickSaveOnly();
    await expect(page.locator("text=Maximum length")).toBeVisible();
  });

  test("should Save with Address Line 2 exceeding 100 characters (WM_SAVE_017)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      address2: "A".repeat(101),
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.clickSaveOnly();
    await expect(page.locator("text=Maximum length")).toBeVisible();
  });

  test("should Save with Address Line 3 exceeding 100 characters (WM_SAVE_018)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      address3: "A".repeat(101),
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.clickSaveOnly();
    await expect(page.locator("text=Maximum length")).toBeVisible();
  });

  test("should Save with Pincode exactly 10 characters (WM_SAVE_019)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      pincode: "1234567890",
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.saveAndConfirm();
    await expect(
      page,
      warehouseExpectUrl("to redirect to the Warehouse Master list after save"),
    ).toHaveURL(
      new RegExp(
        `\${WAREHOUSE_MASTER_ROUTES.list().replace(/\\//g, '\\\\/')}\$`,
      ),
    );
  });

  test("should Save with Pincode more than 10 characters (WM_SAVE_020)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      pincode: "12345678901",
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.clickSaveOnly();
    await expect(page.locator("text=Maximum length")).toBeVisible();
  });

  test("should Save with invalid Pincode format (WM_SAVE_021)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      pincode: "ABC@123",
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.clickSaveOnly();
    await expect(page.locator("text=Invalid pincode")).toBeVisible();
  });

  test("should Save In-house Warehouse with Ownership=Own (WM_SAVE_022)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      ownership: "Own",
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.saveAndConfirm();
    await expect(
      page,
      warehouseExpectUrl("to redirect to the Warehouse Master list after save"),
    ).toHaveURL(
      new RegExp(
        `\${WAREHOUSE_MASTER_ROUTES.list().replace(/\\//g, '\\\\/')}\$`,
      ),
    );
  });

  test("should Save In-house Warehouse with Ownership blank (WM_SAVE_023)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      ownership: "",
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.saveAndConfirm();
    await expect(
      page,
      warehouseExpectUrl("to redirect to the Warehouse Master list after save"),
    ).toHaveURL(
      new RegExp(
        `\${WAREHOUSE_MASTER_ROUTES.list().replace(/\\//g, '\\\\/')}\$`,
      ),
    );
  });

  test("should Save External Warehouse without Ownership (WM_SAVE_024)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "External",
      ownership: "",
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.clickSaveOnly();
    await expect(page.locator("text=Ownership is required")).toBeVisible();
  });

  test("should Save External Warehouse with Ownership=Own (WM_SAVE_025)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "External",
      ownership: "Own",
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.clickSaveOnly();
    await expect(
      page.locator("text=Validation displayed according to business rule"),
    ).toBeVisible();
  });

  test("should Save External Warehouse with Ownership=Party but Party blank (WM_SAVE_026)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "External",
      ownership: "Party",
      party: null,
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.clickSaveOnly();
    await expect(page.locator("text=Party is required")).toBeVisible();
  });

  test("should Save Ownership=Own with Party selected (WM_SAVE_027)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      ownership: "Own",
      party: { query: "Vendor A", value: "Vendor A" },
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.clickSaveOnly();
    await expect(page.locator("text=Party must remain blank")).toBeVisible();
  });

  test("should Save with inactive Party selected (WM_SAVE_028)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "External",
      ownership: "Party",
      party: { query: "Inactive Vendor", value: "Inactive Vendor" },
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.clickSaveOnly();
    await expect(page.locator("text=Inactive Party")).toBeVisible();
  });

  test("should Save with inactive Location (WM_SAVE_029)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Inactive Loc", value: "Inactive Loc" },
      type: "In-house",
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.clickSaveOnly();
    await expect(page.locator("text=Inactive Location")).toBeVisible();
  });

  test("should Save with inactive City (WM_SAVE_030)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      city: { query: "Inactive City", value: "Inactive City" },
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.clickSaveOnly();
    await expect(page.locator("text=Inactive City")).toBeVisible();
  });

  test("should Save with inactive State (WM_SAVE_031)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      state: { query: "Inactive State", value: "Inactive State" },
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.clickSaveOnly();
    await expect(page.locator("text=Inactive State")).toBeVisible();
  });

  test("should Save with City-State mismatch (WM_SAVE_032)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      city: { query: "Delhi", value: "Delhi" },
      state: { query: "Maharashtra", value: "Maharashtra" },
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.clickSaveOnly();
    await expect(page.locator("text=Mapping validation")).toBeVisible();
  });

  test("should Save with State-Country mismatch (WM_SAVE_033)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      state: { query: "Delhi", value: "Delhi" },
      country: { query: "USA", value: "USA" },
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.clickSaveOnly();
    await expect(page.locator("text=Mapping validation")).toBeVisible();
  });

  test("should Save with valid City-State-Country mapping (WM_SAVE_034)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      city: { query: "Delhi", value: "Delhi" },
      state: { query: "Delhi", value: "Delhi" },
      country: { query: "India", value: "India" },
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.saveAndConfirm();
    await expect(
      page,
      warehouseExpectUrl("to redirect to the Warehouse Master list after save"),
    ).toHaveURL(
      new RegExp(
        `\${WAREHOUSE_MASTER_ROUTES.list().replace(/\\//g, '\\\\/')}\$`,
      ),
    );
  });

  test("should Save with Address fields blank (WM_SAVE_035)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      address1: "",
      address2: "",
      address3: "",
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.saveAndConfirm();
    await expect(
      page,
      warehouseExpectUrl("to redirect to the Warehouse Master list after save"),
    ).toHaveURL(
      new RegExp(
        `\${WAREHOUSE_MASTER_ROUTES.list().replace(/\\//g, '\\\\/')}\$`,
      ),
    );
  });

  test("should Save after auto-populated State/Country from City (WM_SAVE_036)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      city: { query: "Mumbai", value: "Mumbai" },
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.saveAndConfirm();
    await expect(
      page,
      warehouseExpectUrl("to redirect to the Warehouse Master list after save"),
    ).toHaveURL(
      new RegExp(
        `\${WAREHOUSE_MASTER_ROUTES.list().replace(/\\//g, '\\\\/')}\$`,
      ),
    );
  });

  test("should Save after manually changing auto-populated State (WM_SAVE_037)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      city: { query: "Mumbai", value: "Mumbai" },
      state: { query: "Delhi", value: "Delhi" },
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.clickSaveOnly();
    await expect(page.locator("text=Mapping validation")).toBeVisible();
  });

  test("should Double-click Save button (WM_SAVE_038)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.clickSaveOnly();
    await warehouseMasterFormPage.clickSaveOnly();
    await warehouseMasterFormPage.acceptSaveConfirmation();
    // Verify only one save
  });

  test("should Click Save multiple times rapidly (WM_SAVE_039)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await Promise.all([
      warehouseMasterFormPage.clickSaveOnly(),
      warehouseMasterFormPage.clickSaveOnly(),
      warehouseMasterFormPage.clickSaveOnly(),
    ]);
    await warehouseMasterFormPage.acceptSaveConfirmation();
    // Verify only one save
  });

  test("should Save after correcting validation errors (WM_SAVE_040)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "",
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.clickSaveOnly();
    await expect(page.locator("text=Warehouse Name is required")).toBeVisible();
    await warehouseMasterFormPage.fill({ warehouseName: "WH" + Date.now() });
    await warehouseMasterFormPage.saveAndConfirm();
    await expect(
      page,
      warehouseExpectUrl("to redirect to the Warehouse Master list after save"),
    ).toHaveURL(
      new RegExp(
        `\${WAREHOUSE_MASTER_ROUTES.list().replace(/\\//g, '\\\\/')}\$`,
      ),
    );
  });

  test("should Save with leading spaces in Warehouse Name (WM_SAVE_041)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "   Warehouse A",
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.saveAndConfirm();
    await expect(
      page,
      warehouseExpectUrl("to redirect to the Warehouse Master list after save"),
    ).toHaveURL(
      new RegExp(
        `\${WAREHOUSE_MASTER_ROUTES.list().replace(/\\//g, '\\\\/')}\$`,
      ),
    );
  });

  test("should Save with trailing spaces in Warehouse Name (WM_SAVE_042)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "Warehouse A   ",
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.saveAndConfirm();
    await expect(
      page,
      warehouseExpectUrl("to redirect to the Warehouse Master list after save"),
    ).toHaveURL(
      new RegExp(
        `\${WAREHOUSE_MASTER_ROUTES.list().replace(/\\//g, '\\\\/')}\$`,
      ),
    );
  });

  test("should Save with Warehouse Name containing only spaces (WM_SAVE_043)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "     ",
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.clickSaveOnly();
    await expect(page.locator("text=Warehouse Name is required")).toBeVisible();
  });

  test("should Save with special characters in Warehouse Name (WM_SAVE_044)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "Warehouse-01 (North)",
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.saveAndConfirm();
    await expect(
      page,
      warehouseExpectUrl("to redirect to the Warehouse Master list after save"),
    ).toHaveURL(
      new RegExp(
        `\${WAREHOUSE_MASTER_ROUTES.list().replace(/\\//g, '\\\\/')}\$`,
      ),
    );
  });

  test("should Save with Unicode characters in Warehouse Name (WM_SAVE_045)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "Gódown Á",
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.saveAndConfirm();
    await expect(
      page,
      warehouseExpectUrl("to redirect to the Warehouse Master list after save"),
    ).toHaveURL(
      new RegExp(
        `\${WAREHOUSE_MASTER_ROUTES.list().replace(/\\//g, '\\\\/')}\$`,
      ),
    );
  });

  test("should Save after changing Warehouse Type from External to In-house (WM_SAVE_046)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "External",
      party: { query: "Vendor A", value: "Vendor A" },
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.fill({ type: "In-house" });
    await warehouseMasterFormPage.saveAndConfirm();
    await expect(
      page,
      warehouseExpectUrl("to redirect to the Warehouse Master list after save"),
    ).toHaveURL(
      new RegExp(
        `\${WAREHOUSE_MASTER_ROUTES.list().replace(/\\//g, '\\\\/')}\$`,
      ),
    );
  });

  test("should Save after changing Ownership from Party to Own (WM_SAVE_047)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "External",
      ownership: "Party",
      party: { query: "Vendor A", value: "Vendor A" },
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.fill({ ownership: "Own" });
    await warehouseMasterFormPage.saveAndConfirm();
    await expect(
      page,
      warehouseExpectUrl("to redirect to the Warehouse Master list after save"),
    ).toHaveURL(
      new RegExp(
        `\${WAREHOUSE_MASTER_ROUTES.list().replace(/\\//g, '\\\\/')}\$`,
      ),
    );
  });

  test("should Save using keyboard shortcut (if supported) (WM_SAVE_048)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await page.keyboard.press("Control+s");
    // Verify save or confirmation
    await warehouseMasterFormPage.acceptSaveConfirmation();
    await expect(
      page.locator(".z-toast").filter({ hasText: /successfully/i }),
    ).toBeVisible({ timeout: 30000 });
  });

  test("should Save when network request fails (WM_SAVE_049)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await page.route("**/warehouse-master", (route) => route.abort("failed"));
    await warehouseMasterFormPage.clickSaveOnly();
    await warehouseMasterFormPage.acceptSaveConfirmation();
    await expect(
      page.locator(".z-toast").filter({ hasText: /error/i }),
    ).toBeVisible();
    await page.unroute("**/warehouse-master");
  });

  test("should Save when API returns validation errors (WM_SAVE_050)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await page.route("**/warehouse-master", (route) =>
      route.fulfill({
        status: 400,
        body: JSON.stringify({ message: "Validation Failed" }),
      }),
    );
    await warehouseMasterFormPage.clickSaveOnly();
    await warehouseMasterFormPage.acceptSaveConfirmation();
    await expect(
      page.locator(".z-toast").filter({ hasText: /Validation Failed/i }),
    ).toBeVisible();
    await page.unroute("**/warehouse-master");
  });

  test("should Save after session timeout (WM_SAVE_051)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await page.route("**/warehouse-master", (route) =>
      route.fulfill({ status: 401 }),
    );
    await warehouseMasterFormPage.clickSaveOnly();
    await warehouseMasterFormPage.acceptSaveConfirmation();
    await expect(page).toHaveURL(/.*login.*/);
    await page.unroute("**/warehouse-master");
  });

  test("should Save with SQL Injection attempt (WM_SAVE_052)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "' OR 1=1 --",
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.saveAndConfirm();
    await expect(
      page,
      warehouseExpectUrl("to redirect to the Warehouse Master list after save"),
    ).toHaveURL(
      new RegExp(
        `\${WAREHOUSE_MASTER_ROUTES.list().replace(/\\//g, '\\\\/')}\$`,
      ),
    );
  });

  test("should Save with HTML/JavaScript input (WM_SAVE_053)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "<script>alert(1)</script>",
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.saveAndConfirm();
    await expect(
      page,
      warehouseExpectUrl("to redirect to the Warehouse Master list after save"),
    ).toHaveURL(
      new RegExp(
        `\${WAREHOUSE_MASTER_ROUTES.list().replace(/\\//g, '\\\\/')}\$`,
      ),
    );
  });

  test("should Save with browser refresh before saving (WM_SAVE_054)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await page.reload();
    await warehouseMasterFormPage.clickSaveOnly();
    await expect(page.locator("text=Warehouse Name is required")).toBeVisible();
  });

  test("should Save after modifying every editable field (WM_SAVE_055)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "External",
      ownership: "Party",
      party: { query: "Vendor A", value: "Vendor A" },
      address1: "Address 1",
      address2: "Address 2",
      address3: "Address 3",
      pincode: "111111",
      country: { query: "India", value: "India" },
      state: { query: "Delhi", value: "Delhi" },
      city: { query: "Delhi", value: "Delhi" },
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.fill({
      address1: "New Address 1",
      status: "Inactive",
      statusRemarks: "Modified",
    });
    await warehouseMasterFormPage.saveAndConfirm();
    await expect(
      page,
      warehouseExpectUrl("to redirect to the Warehouse Master list after save"),
    ).toHaveURL(
      new RegExp(
        `\${WAREHOUSE_MASTER_ROUTES.list().replace(/\\//g, '\\\\/')}\$`,
      ),
    );
  });

  test("should Save after selecting inactive Status with valid Status Remark (WM_SAVE_056)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      status: "Inactive",
      statusRemarks: "Closed",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.saveAndConfirm();
    await expect(
      page,
      warehouseExpectUrl("to redirect to the Warehouse Master list after save"),
    ).toHaveURL(
      new RegExp(
        `\${WAREHOUSE_MASTER_ROUTES.list().replace(/\\//g, '\\\\/')}\$`,
      ),
    );
  });

  test("should Save after entering maximum Status Remark (300 characters) (WM_SAVE_057)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      status: "Inactive",
      statusRemarks: "A".repeat(300),
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.saveAndConfirm();
    await expect(
      page,
      warehouseExpectUrl("to redirect to the Warehouse Master list after save"),
    ).toHaveURL(
      new RegExp(
        `\${WAREHOUSE_MASTER_ROUTES.list().replace(/\\//g, '\\\\/')}\$`,
      ),
    );
  });

  test("should Save with Status Remark exceeding 300 characters (WM_SAVE_058)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      status: "Inactive",
      statusRemarks: "A".repeat(301),
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.clickSaveOnly();
    await expect(page.locator("text=Maximum length")).toBeVisible();
  });

  test("should Save with all optional fields populated using maximum allowed lengths (WM_SAVE_059)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "A".repeat(50),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      address1: "B".repeat(100),
      address2: "C".repeat(100),
      address3: "D".repeat(100),
      pincode: "1234567890",
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.saveAndConfirm();
    await expect(
      page,
      warehouseExpectUrl("to redirect to the Warehouse Master list after save"),
    ).toHaveURL(
      new RegExp(
        `\${WAREHOUSE_MASTER_ROUTES.list().replace(/\\//g, '\\\\/')}\$`,
      ),
    );
  });

  test("should Verify success message after successful save (WM_SAVE_060)", async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const data = {
      warehouseName: "WH" + Date.now(),
      location: { query: "Loc1", value: "Location 1" },
      type: "In-house",
      status: "Active",
    };

    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    await warehouseMasterFormPage.saveAndConfirm();
    // saveAndConfirm already waits for the success toast and docNo/id.
    await expect(
      page,
      warehouseExpectUrl("to redirect to the Warehouse Master list after save"),
    ).toHaveURL(
      new RegExp(
        `\${WAREHOUSE_MASTER_ROUTES.list().replace(/\\//g, '\\\\/')}\$`,
      ),
    );
  });
});
