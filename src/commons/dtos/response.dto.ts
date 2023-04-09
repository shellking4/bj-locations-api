
export class SuccessResponseDto {
    success: boolean;
}

export class PaginateResponseDto {
    data: any;
    dataCount: number;
    totalRecordsCount: number;
    pageNumbers: string[]
}