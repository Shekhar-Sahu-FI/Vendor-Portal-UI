import { APIRequestContext } from '@playwright/test';
import { ApiClient } from './api-client';
import { PURCHASE_REQUEST_API } from '../../pages/purchase-request/purchase-request.constants';

export class PurchaseRequestApi {
  private client: ApiClient;

  constructor(request: APIRequestContext, token: string, companyId?: number) {
    this.client = new ApiClient(request, token, companyId);
  }

  static async fromLogin(
    request: APIRequestContext,
    username: string,
    password: string,
    companyId?: number,
  ) {
    const token = await ApiClient.login(request, username, password);
    return new PurchaseRequestApi(request, token, companyId);
  }

  async deleteById(id: number) {
    await this.client.delete(PURCHASE_REQUEST_API.delete(id));
  }
}
