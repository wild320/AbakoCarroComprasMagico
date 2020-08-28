import {UsuarioCliente} from '../seguridad/UsuarioCliente';
import {LoginCliente} from '../seguridad/LoginCliente';
import {Mensaje} from '../negocio/Mensaje';

export class LoginClienteResponse {
    usuario: UsuarioCliente;
    comercial: LoginCliente;
    estado: Mensaje;
}
