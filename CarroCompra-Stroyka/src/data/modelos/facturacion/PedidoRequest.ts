import {PedidoDetalle } from '../facturacion/PedidoDetalle';

export class PedidoRequest {
    IdEmp : number;
    Tp: string;
    OtDcto: number;
    Obs: string;
    cnt: number;
    Usr: number;
    Fnt: number;
    Dir: number;
    Fcent: string;
    Fc: string;
    Agn: string;
    Lon: number;
    Lat: number;
    Rfv: string;

    Dll: PedidoDetalle[];

    DllCmb: Array<{
        IdArt: number;
        Cant: number;
        UM: string;
    }>;

    Atr: Array<{
        IdEmpSuc: number;
        Cant: number;
    }>;

}