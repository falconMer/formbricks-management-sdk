// Typed models for the Ror SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
// params (op.<name>.points[].g.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.

export interface Organization {
  domains?: any[]
  id?: string
  locations?: any[]
  names?: any[]
  status?: string
  types?: any[]
}

export interface OrganizationLoadMatch {
  id: string
}

export interface OrganizationListMatch {
  filter?: string
  page?: number
  query?: string
}

