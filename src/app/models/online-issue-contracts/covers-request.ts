import { IHeader } from './header';

export interface ICoversRequest {
    Header: IHeader;
    AgentCode: number;
    CoverParameters: ICoverParameter[];
}

export interface ICoverParameter {
    MotorInsurancePackage: string;
    VehicleUsage: string;
}
