import { IHeader } from './header';

export interface IQuotationResponse {
    CalculatedQuotationsResult: ICalculatedQuotationsResult;
    Header: IHeader;
}

export interface IApplicationResponse {
    Success: boolean;
    Header: IHeader;
    Errors: IError[];
    ProposalNumber: number;
    CustomerID: number;
    ProposalID: number;
    ReferenseNumber: number;
    AAReferenseID: number;
    IsPrintPay: boolean;
}

export interface ICalculatedQuotationsResult {
    InsurancePackage: string;
    OrderId: number;
    Allow: boolean;
    Errors: IError[];
    NumberOfClaims: number;
    PremiumsPayable: IPremiumsPayable[];
    Covers: ICover[];
    Discounts: IDiscount[];
}

export interface IError {
    ErrorCode: string;
    ErrorString: string;
}

export interface IPremiumsPayable {
    MotorInsurancePackage: string;
    DurationInMonths: number;
    GrossPremiums: number;
}

export interface ICover {
    Allowed: boolean;
    Selected: boolean;
    IsMandatory: boolean;
    Description: string;
    ShortDescription: string;
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
