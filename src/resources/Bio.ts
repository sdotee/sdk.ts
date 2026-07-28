import { BaseResource } from "./Base";
import type {
    ApiResponse,
    BioPageCreateRequest,
    BioPageCreateResponse,
    BioPageHistoryResponse,
    BioPageUpdateRequest,
    HistoryParams,
} from "../types";

export class Bio extends BaseResource {
    async create(request: BioPageCreateRequest): Promise<BioPageCreateResponse> {
        const response = await this.client.post<BioPageCreateResponse>("/bio", request);
        return response.data;
    }

    async update(request: BioPageUpdateRequest): Promise<ApiResponse> {
        const response = await this.client.put<ApiResponse>("/bio", request);
        return response.data;
    }

    async delete(id: number): Promise<ApiResponse> {
        const response = await this.client.delete<ApiResponse>("/bio", { data: { id } });
        return response.data;
    }

    async history(params: HistoryParams = {}): Promise<BioPageHistoryResponse> {
        const response = await this.client.get<BioPageHistoryResponse>("/bios", { params });
        return response.data;
    }
}
