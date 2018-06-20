import { IHeader } from './header';

export interface IQuotationRequest {
    Header: IHeader;
    motorQuotationParams: IMotorQuorationParams;
}

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
    DiscountValue: string;
}

export interface IVehicleInfo {
    AssemblyDate: string;
    PurchaseDate: string;
    CC: string;
    PlateNumber: string;
    UsageType: string;
    VehicleValue: number;
    EurotaxModelCode: number;
    IsKeptInGarage: boolean;
    HasAlarmImmobilizer: boolean;
    EurotaxBrandCode: number;
    EurotaxModelGroupCode: number;
}

export interface IOtherDriverInfo {
    BirthDate: string;
    LicenseDate: string;
    TypeOfDriver: number;
}

export interface IMotorQuorationParams {
    MotorInsurancePackage: string;
    InsuranceStartDate: string;
    MainDriverInfo: IMainDriverInfo;
    VehicleInfo: IVehicleInfo;
    MotorCovers: IMotorCover[];
    MotorDiscounts: IMotorDiscount[];
    OtherDrivers: IOtherDriverInfo[];
}
