export interface ApiRequest {
    url: string;
    query: {
        code?: string;
        [key: string]: string | string[] | undefined;
    };
}

export interface ApiResponse {
    redirect(url: string): void;
    json(data: any): void;
    status(code: number): ApiResponse;
}
