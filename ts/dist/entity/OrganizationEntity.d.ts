import { RorEntityBase } from '../RorEntityBase';
import type { RorSDK } from '../RorSDK';
import type { Control } from '../types';
import type { Organization, OrganizationLoadMatch, OrganizationListMatch } from '../RorTypes';
declare class OrganizationEntity extends RorEntityBase<Organization> {
    constructor(client: RorSDK, entopts: any);
    make(this: OrganizationEntity): OrganizationEntity;
    load(this: any, reqmatch?: OrganizationLoadMatch, ctrl?: Control): Promise<OrganizationEntity>;
    list(this: any, reqmatch?: OrganizationListMatch, ctrl?: Control): Promise<OrganizationEntity[]>;
}
export { OrganizationEntity };
