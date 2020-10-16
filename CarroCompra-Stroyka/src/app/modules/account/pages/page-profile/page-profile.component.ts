import { Component, OnInit } from '@angular/core';
import {  FormGroup , FormBuilder, Validators , FormControl} from '@angular/forms';

// servicios
import { UsuarioService } from 'src/app/shared/services/usuario.service';

// utils
import {UtilsTexto} from 'src/app//shared/utils/UtilsTexto';


@Component({
    selector: 'app-page-profile',
    templateUrl: './page-profile.component.html',
    styleUrls: ['./page-profile.component.sass']
})
export class PageProfileComponent implements OnInit {

    public EditarPerfilForm: FormGroup;
    private correo: string;
    private telefono: string;
    public mensajerespuestaexito: string;
    public mensajerespuestaerror: string;

    constructor(public usuariosvc: UsuarioService,
                private utils: UtilsTexto,
                private fb: FormBuilder) {

        this.SetiarMensajes();

    }


    ngOnInit() {

        this.EditarPerfilForm = this.fb.group({
         Nombres: new FormControl('', Validators.compose([Validators.required])),
         Apellidos: new FormControl('', Validators.compose([Validators.required])),
         Correo: new FormControl('', Validators.compose([Validators.required])),
         Telefono: new FormControl('', Validators.compose([Validators.required])),
        });

        this.EstaLogueadoUsuario();

    }

    EstaLogueadoUsuario(){

        this.usuariosvc.getEstadoLogueo().subscribe((value) => {

            this.CargarUsuario();
        });
    }

    submitForm(){

        this.SetiarMensajes();

        if (this.EsValidoFormulario()){

            this.usuariosvc
                .GuardarActualizarUsuario(this.nombres.value, this.apellidos.value, this.mail.value, this.tel.value)
                .then((ret: any) => {

                console.log (ret);

                this.mensajerespuestaexito = 'Datos ingresados exitosamente.';

            });
        }

    }

    SetiarMensajes(){
        this.mensajerespuestaexito = '';
        this.mensajerespuestaerror = '';
    }

    EsValidoFormulario(): boolean{

        if (this.nombres.invalid){
            this.mensajerespuestaerror = 'Debe ingresar información valida en Nombres';
            return false;
        }

        if (this.apellidos.invalid){
            this.mensajerespuestaerror = 'Debe ingresar información valida en Apellidos';
            return false;
        }

        if (this.mail.invalid){
            this.mensajerespuestaerror = 'Debe ingresar información valida en Correo Electrónico';
            return false;
        }

        if (this.tel.invalid){
            this.mensajerespuestaerror = 'Debe ingresar información valida en Teléfono';
            return false;
        }

        if (!this.utils.EsCorreoValido(this.mail.value) ){
            this.mensajerespuestaerror = 'El Correo Electrónico es invalido';
            return false;
        }

        return true;

    }

    CargarUsuario(){

        if  (this.usuariosvc.UsrLogin
            && this.EditarPerfilForm !== undefined
            && this.usuariosvc.DatosPersona !== undefined ){

            if (this.usuariosvc.DatosPersona.dllMail.length){
                this.correo = this.usuariosvc.DatosPersona.dllMail[0].mail;
            }

            if (this.usuariosvc.DatosPersona.dllTelefono.length){
                this.telefono = this.usuariosvc.DatosPersona.dllTelefono[0].telefono;
            }

            this.EditarPerfilForm.patchValue({
                Nombres: this.usuariosvc.UsrLogin.usuario[0].nmb,
                Apellidos: this.usuariosvc.UsrLogin.usuario[0].apll,
                Correo: this.correo,
                Telefono: this.telefono,
            });
        }
    }

    get nombres() { return this.EditarPerfilForm.get('Nombres'); }
    get apellidos() { return this.EditarPerfilForm.get('Apellidos'); }
    get mail() { return this.EditarPerfilForm.get('Correo'); }
    get tel() { return this.EditarPerfilForm.get('Telefono'); }
}
