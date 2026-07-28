import { BaseResource } from "./Base";
import type {
    ApiResponse,
    HistoryParams,
    QrcodeCreateRequest,
    QrcodeCreateResponse,
    QrcodeDeleteRequest,
    QrcodeHistoryResponse,
} from "../types";

export class Qrcode extends BaseResource {
    async create(request: QrcodeCreateRequest): Promise<QrcodeCreateResponse> {
        const response = await this.client.post<QrcodeCreateResponse>("/qrcode", request);
        return response.data;
    }

    async delete(request: QrcodeDeleteRequest): Promise<ApiResponse> {
        const response = await this.client.delete<ApiResponse>("/qrcode", { data: request });
        return response.data;
    }

    async history(params: HistoryParams = {}): Promise<QrcodeHistoryResponse> {
        const response = await this.client.get<QrcodeHistoryResponse>("/qrcodes", { params });
        return response.data;
    }
}
