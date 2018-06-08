import { IHeader } from './header';

export interface IFastQuotationResponse {
    CalculatedQuotationsResult: ICalculatedQuotationsResult;
    Header: IHeader;
}

export interface ICalculatedQuotationsResult {
    InsurancePackage: string;
    OrderId: number;
    Allow: boolean;
    Errors: IError[];
    NumberOfClaims: number;
    Covers: ICover[];
    Discounts: IDiscount[];
}

export interface IError {
    ErrorCode: string;
    ErrorString: string;
}

export interface ICover {
    Allowed: boolean;
    Selected: boolean;
    IsMandatory: boolean;
    Description: string;
    CanCombineWithPackage: boolean;
    MotorCoverItem: number;
    VisibilityOrder: number;
    Code: string;
    CoverPremia: ICoverPremiums[];
}

export interface ICoverPremiums {
    Duration: number;
    CoverPremium: number;
}

export interface IDiscount {
    Allowed: boolean;
    Selected: boolean;
    DiscountValue: string;
    MotorDiscountItem: number;
    Description: string;
    RequiresInputField: boolean;
}
