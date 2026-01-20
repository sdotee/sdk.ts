/*!*
 * Copyright (c) 2025 S.EE Development Team
 *
 * This source code is licensed under the MIT License,
 * which is located in the LICENSE file in the source tree's root directory.
 *
 * File: Base.ts
 * Author: S.EE Development Team <dev@s.ee>
 */

import type { AxiosInstance } from "axios";

export abstract class BaseResource {
    protected client: AxiosInstance;

    constructor(client: AxiosInstance) {
        this.client = client;
    }
}
