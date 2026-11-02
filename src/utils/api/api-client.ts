import { APIRequestContext } from '@playwright/test';
import { env } from '../env';

export type LoginTokens = {
  authToken: string;
  refreshToken?: string;
};

export class ApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly token: string,
    private readonly companyId?: number,
  ) {}

  private headers() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
      ...(this.companyId ? { CompanyId: String(this.companyId) } : {}),
    };
  }

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    const response = await this.request.post(`${env.apiBaseUrl}${endpoint}`, {
      headers: this.headers(),
      data: body,
    });
    if (!response.ok()) {
      throw new Error(`API POST ${endpoint} failed: ${response.status()} ${await response.text()}`);
    }
    const json = await response.json();
    return (json.data ?? json) as T;
  }

  async delete(endpoint: string): Promise<void> {
    const response = await this.request.delete(`${env.apiBaseUrl}${endpoint}`, {
      headers: this.headers(),
    });
    if (!response.ok()) {
      throw new Error(`API DELETE ${endpoint} failed: ${response.status()} ${await response.text()}`);
    }
  }

  static async loginWithTokens(
    request: APIRequestContext,
    username: string,
    password: string,
  ): Promise<LoginTokens> {
    const apiBaseUrl = env.apiBaseUrl.replace('://localhost', '://127.0.0.1');
    const response = await request.post(`${apiBaseUrl}/api/Auth/login/`, {
      headers: { 'Content-Type': 'application/json' },
      data: { username, password },
    });
    if (!response.ok()) {
      throw new Error(`Login failed: ${response.status()} ${await response.text()}`);
    }
    const json = await response.json();
    const data = json.data ?? json;
    const authToken = data.token ?? data.accessToken ?? json.token;
    if (!authToken) {
      throw new Error('Login response did not include a token');
    }
    return {
      authToken,
      refreshToken: data.refreshToken ?? json.refreshToken,
    };
  }

  static async login(request: APIRequestContext, username: string, password: string): Promise<string> {
    const tokens = await ApiClient.loginWithTokens(request, username, password);
    return tokens.authToken;
  }
}
