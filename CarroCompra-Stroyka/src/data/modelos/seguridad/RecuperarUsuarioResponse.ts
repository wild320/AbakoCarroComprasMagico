import {Mensaje} from '../negocio/Mensaje';

export class RecuperarUsuarioResponse {
    idPersona: number;
    codigoSeguridad: string;
    estado: Mensaje;
}
