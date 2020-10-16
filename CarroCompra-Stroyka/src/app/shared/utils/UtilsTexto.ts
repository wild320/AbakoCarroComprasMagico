export class UtilsTexto {

    capitalize(texto) {
        return texto.charAt(0).toUpperCase() + texto.slice(1);
    }

    EsCorreoValido(correo: string): boolean {

        const expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if ( !expr.test(correo) ){
            return false;
        }else{
            return true;
        }

    }
}
