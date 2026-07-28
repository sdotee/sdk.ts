/*!*
 * Copyright (c) 2026 S.EE Development Team
 *
 * This source code is licensed under the MIT License,
 * which is located in the LICENSE file in the source tree's root directory.
 *
 * File: Account.ts
 * Author: S.EE Development Team <dev@s.ee>
 * File Created: 2026-07-28 20:01:27
 *
 * Modified By: S.EE Development Team <dev@s.ee>
 * Last Modified: 2026-07-28 20:01:30
 */

import { BaseResource } from './Base';
import type { TokenCheckResponse, UsageResponse } from '../types';

export class Account extends BaseResource {
  async checkToken(token: string): Promise<TokenCheckResponse> {
    const response = await this.client.post<TokenCheckResponse>('/token/check', { token });
    return response.data;
  }

  async usage(): Promise<UsageResponse> {
    const response = await this.client.get<UsageResponse>('/usage');
    return response.data;
  }
}
