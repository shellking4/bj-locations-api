
export class GetDepartmentByNameDto {
    name: string;
    createdAt: string;
}

export class GetDepartmentTownsDto {
    department: string;
    towns: string[];
}

export class GetDepartmentDistrictsDto {
    department: string;
    districts: string[];
}

export class GetDepartmentNeighborhoodsDto {
    department: string;
    neighborhoods: string[];
}

export class GetDistrictNeighborhoodsDto {
    district: string;
    neighborhoods: string[];
}

export class GetTownDto {
    id: string;
    name: string;
}

export class GetTownDistrictsDto {
    town: string;
    districts: string[];
}

export class GetTownNeighborhoodsDto {
    town: string;
    neighborhoods: string[];
}

export class GetNeighborhoods {
    data: string[];
    dataCount: number;
    totalRecordsCount: number;
    pageNumbers: string[];
}
