export class UtilsTexto {

    capitalize(texto) {
        return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
    }

    TitleCase(texto) {
        texto = texto.toLowerCase().replace(/\b[a-z]/g, txt => {
            return txt.toUpperCase();
        });

        return texto;
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
