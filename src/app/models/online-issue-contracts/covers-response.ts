import { IHeader } from './header';

export interface ICoversResponse {
    Success: boolean;
    Header: IHeader;
    CoversCollection: ICoversCollectionItem[];
}


export interface ICoversCollectionItem {
    motorCoverParams: {
        MotorInsurancePackage: string;
        VehicleUsage: string;
        VehicleValue: 0
    };
    CoverItem: ICoverItem[];
}

export interface ICoverItem {
    Allowed: boolean;
    DenialDescription: string;
    Selected: boolean;
    IsMandatory: boolean;
    Description: string;
    Code: string;
    CanCombineWithPackage: boolean;
    MotorCoverItem: number;
    VisibilityOrder: number;
    ShortDescription: string;
}
