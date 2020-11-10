export class Persona {
    idPersona: number;
    nombres: string;
    apellidos: string;
    idTipoDocumento: number;
    identificacion: string;
    dllUsuario:
    {
        usuario: string,
        contrasena: string,
    };

    dllDireccion: Array<{
        idDireccion: number,
        idTipoDireccion: number,
        idBarrio: number,
        idEstrato: number,
        idPrefijoDireccionUno: number,
        parteUno: string,
        parteDos: string,
        parteTres: string,
        predeterminado: number,
        codigoPostal: string,
        operacion: string,
        barrio: string,
        ciudad: string,
        departamento: string,
        pais: string,
        direccion: string,
    }>;

    dllTelefono: Array<{
        idTelefono: number,
        idTipoTelefono: number,
        indicativoPais: string,
        indicativoArea: string,
        telefono: string,
        extension: string,
        predeterminado: number,
        operacion: string,
    }>;

    dllMail: Array<{
        idMail: number;
        idTipoEmail: number;
        mail: string;
        predeterminado: number;
        operacion: string;
    }>;

    empresaUsuario: {
        idEmpresa: number,
        identificacion: string,
        razon_Social: string,
        nombre_Comun: string
    };

    estado: Array<{
        msgId: number,
        msgStr: string,
    }>;
}
