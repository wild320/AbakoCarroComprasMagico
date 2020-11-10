export class MaestrosLocalizacionResponse {
    barrios: Array<{
        dirIdBarr: number;
        barrio: string;
        ciudad: string;
        departamento: string;
    }>;

    prefijos: Array<{
        idPref: number;
        prefijo: string;
    }>;

    canales: Array<{
        idCnl: number;
        cnl: string;
    }>;

    segmentos: Array<{
        idSeg: number;
        seg: string,
    }>;

    zonas: Array<{
        idZn: number;
        zn: string;
    }>;

    tipoTelefono: Array<{
        idTpTl: number;
        tipo: string;
    }>;

    tipoMail: Array<{
        idTpMl: number;
        tipo: string;
    }>;

    tipoDireccion: Array<{
        idTpDr: number;
        tipo: string;
    }>;

    msgId: number;
    msgStr: string;

}
