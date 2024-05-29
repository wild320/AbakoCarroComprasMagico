export class CrearClienteCarroRequestv1 {
    idEmp: number;
    idUsr: number;
    idZn: number;
    idCnl: number;
    idSgt: number;
    idnt: string;
    idTpdoc: number;
    rzScl: string;
    nmbCmn: string;
    nmbCtt: string;
    aplCtt: string;
    mail: string;
    tel: string;
    idPref: number;
    dirNum: string;
    dirInter: string;
    dirDet: string;
    dirIdBarr: number;
    fc: string;
    lon: number;
    lat: number;
    rfv: string;
    rut: Rut[];

  }


  export class Rut {
      dia: number;
      orden: number;
    }
