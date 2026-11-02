import { expect, Page } from '@playwright/test';
import { FormLayoutPage } from '../base/form-layout.page';
import { 
  WAREHOUSE_GENERAL_DETAIL_LABELS, 
  WAREHOUSE_ADDRESS_DETAIL_LABELS,
  WAREHOUSE_STATUS_DETAIL_LABELS,
  WAREHOUSE_MASTER_ROUTES 
} from './warehouse-master.constants';
import { getInputsByLabel, setField, fillTextField, getFieldContainer, selectOption } from '../../utils/field-accessor';
import { selectFromAutoSuggestion } from '../../utils/auto-suggestion.helper';
import { captureSaveResponse } from '../../utils/save-response.helper';

export interface WarehouseFillData {
  warehouseName?: string;
  location?: { query: string; value: string };
  type?: string;
  ownership?: string;
  party?: { query: string; value: string };
  address1?: string;
  address2?: string;
  address3?: string;
  pincode?: string;
  country?: { query: string; value: string };
  state?: { query: string; value: string };
  city?: { query: string; value: string };
  status?: string;
  statusRemarks?: string;
}

export class WarehouseMasterFormPage extends FormLayoutPage {
  constructor(page: Page) {
    super(page, WAREHOUSE_MASTER_ROUTES.new());
  }

  async fill(data: WarehouseFillData = {}): Promise<void> {
    if (data.warehouseName !== undefined) {
      await fillTextField(this.page, WAREHOUSE_GENERAL_DETAIL_LABELS.warehouseName, data.warehouseName);
    }
    
    if (data.location) {
      const locationInput = getInputsByLabel(this.page, WAREHOUSE_GENERAL_DETAIL_LABELS.location);
      await selectFromAutoSuggestion(this.page, locationInput, data.location.query, data.location.value);
    }
    
    if (data.type) {
      await selectOption(this.page, WAREHOUSE_GENERAL_DETAIL_LABELS.type, data.type);
    }

    if (data.ownership) {
      await selectOption(this.page, WAREHOUSE_GENERAL_DETAIL_LABELS.ownership, data.ownership);
    }

    if (data.party) {
      const partyInput = getInputsByLabel(this.page, WAREHOUSE_GENERAL_DETAIL_LABELS.party);
      await selectFromAutoSuggestion(this.page, partyInput, data.party.query, data.party.value);
    }

    if (data.address1 !== undefined) {
      await fillTextField(this.page, WAREHOUSE_ADDRESS_DETAIL_LABELS.address1, data.address1);
    }

    if (data.address2 !== undefined) {
      await fillTextField(this.page, WAREHOUSE_ADDRESS_DETAIL_LABELS.address2, data.address2);
    }

    if (data.address3 !== undefined) {
      await fillTextField(this.page, WAREHOUSE_ADDRESS_DETAIL_LABELS.address3, data.address3);
    }

    if (data.pincode !== undefined) {
      await fillTextField(this.page, WAREHOUSE_ADDRESS_DETAIL_LABELS.pincode, data.pincode);
    }

    if (data.country) {
      const countryInput = getInputsByLabel(this.page, WAREHOUSE_ADDRESS_DETAIL_LABELS.country);
      await selectFromAutoSuggestion(this.page, countryInput, data.country.query, data.country.value);
    }

    if (data.state) {
      const stateInput = getInputsByLabel(this.page, WAREHOUSE_ADDRESS_DETAIL_LABELS.state);
      await selectFromAutoSuggestion(this.page, stateInput, data.state.query, data.state.value);
    }

    if (data.city) {
      const cityInput = getInputsByLabel(this.page, WAREHOUSE_ADDRESS_DETAIL_LABELS.city);
      await selectFromAutoSuggestion(this.page, cityInput, data.city.query, data.city.value);
    }

    if (data.status) {
      await selectOption(this.page, WAREHOUSE_STATUS_DETAIL_LABELS.status, data.status);
    }

    if (data.statusRemarks !== undefined) {
      await fillTextField(this.page, WAREHOUSE_STATUS_DETAIL_LABELS.statusRemarks, data.statusRemarks);
    }
  }

  async saveAndConfirm(): Promise<string> {
    const { data } = await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/warehouses/i,
    );
    return (data?.warehouseName as string) || (data?.code as string) || '';
  }

  async clickSaveOnly(): Promise<void> {
    await this.clickSave();
  }

  async updateWarehouseName(newName: string): Promise<void> {
    await fillTextField(this.page, WAREHOUSE_GENERAL_DETAIL_LABELS.warehouseName, newName);
    await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/warehouses/i,
    );
  }

  async deleteCurrent(deleteReason?: string): Promise<void> {
    await this.openActionsMenu();
    await this.page.getByRole('button', { name: 'Delete', exact: true }).click();
    if (deleteReason) {
      await this.dialog.confirmDeleteWithReason(deleteReason);
    } else {
      await this.dialog.confirmDelete();
    }
  }
}
