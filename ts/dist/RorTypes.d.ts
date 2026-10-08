export interface Organization {
    domains?: any[];
    id?: string;
    locations?: any[];
    names?: any[];
    status?: string;
    types?: any[];
}
export interface OrganizationLoadMatch {
    id: string;
}
export interface OrganizationListMatch {
    filter?: string;
    page?: number;
    query?: string;
}
