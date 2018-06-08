import { IHeader } from './header';

export interface IMainDriverInfo {
    BirthDate: string;
    LicenseDate: string;
    PostalCode: string;
}

export interface IMotorCover {
    Selected: boolean;
    MotorCoverItem: number;
}

export interface IMotorDiscount {
    Selected: boolean;
    MotorDiscountItem: number;
}

export interface IVehicleInfo {
    AssemblyDate: string;
    PurchaseDate: string;
    HP: string;
    PlateNumber: string;
    UsageType: string;
    VehicleValue: number;
    EurotaxModelCode: number;
    IsKeptInGarage: boolean;
    HasAlarmImmobilizer: boolean;
    EurotaxBrandCode: number;
    EurotaxModelGroupCode: number;
}

export interface IMotorQuorationParams {
    InsuranceStartDate: string;
    MainDriverInfo: IMainDriverInfo;
    VehicleInfo: IVehicleInfo;
    MotorCovers: IMotorCover[];
    MotorDiscounts: IMotorDiscount[];
}

export interface IFastQuotationRequest {
    Header: IHeader;
    motorQuotationParams: IMotorQuorationParams;
}
