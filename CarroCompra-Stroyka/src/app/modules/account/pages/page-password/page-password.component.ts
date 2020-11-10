import { Component, OnInit } from '@angular/core';
import {  FormGroup , FormBuilder, Validators , FormControl} from '@angular/forms';

// servicios
import { UsuarioService } from 'src/app/shared/services/usuario.service';

// Contantes
import { EstadoRespuestaMensaje } from 'src/data/contantes/cMensajes';

@Component({
    selector: 'app-page-password',
    templateUrl: './page-password.component.html',
    styleUrls: ['./page-password.component.sass']
})
export class PagePasswordComponent implements OnInit {

    public EditarContrasenaForm: FormGroup;
    public mensajerespuestaexito: string;
    public mensajerespuestaerror: string;
    public loading: boolean;

    constructor(public usuariosvc: UsuarioService,
                private fb: FormBuilder) {

        this.loading = false;

        this.SetiarMensajes();

    }

    ngOnInit() {

        this.EditarContrasenaForm = this.fb.group({
            ContrasenaActual: new FormControl('', Validators.compose([Validators.required])),
            ContrasenaNueva: new FormControl('', Validators.compose([Validators.required])),
            ContrasenaRepetir: new FormControl('', Validators.compose([Validators.required])),

        });

    }

    SetiarMensajes(){
        this.mensajerespuestaexito = '';
        this.mensajerespuestaerror = '';
    }

    submitForm(){

        this.SetiarMensajes();

        this.loading = true;

        if (this.EsValidoFormulario()){

             this.usuariosvc.GuardarActualizarContrasena(this.ContrasenaNueva.value)
                .then((ret: any) => {

                if (ret.estado[0].msgId === EstadoRespuestaMensaje.Error ){
                    this.mensajerespuestaerror = ret.estado[0].msgStr;

                }else{
                    this.mensajerespuestaexito = 'Datos ingresados exitosamente.';
                }

            });
        }

        this.loading = false;

    }

    EsValidoFormulario(): boolean{

        if (this.ContrasenaActual.invalid){
            this.mensajerespuestaerror = 'Debe ingresar información valida en Contraseña Actual';
            return false;
        }

        if (this.ContrasenaNueva.invalid){
            this.mensajerespuestaerror = 'Debe ingresar información valida en Nueva Contraseña';
            return false;
        }

        if (this.ContrasenaRepetir.invalid){
            this.mensajerespuestaerror = 'Debe ingresar información valida en Repetir Contraseña';
            return false;
        }

        if (this.ContrasenaRepetir.value !== this.ContrasenaNueva.value ){
            this.mensajerespuestaerror = 'La contraseña nueva y repetir contraseña no son iguales';
            return false;
        }

        if (this.ContrasenaActual.value === this.ContrasenaNueva.value){
            this.mensajerespuestaerror = 'La contraseña anterior y la nueva no pueden ser iguales';
            return false;
        }

        if (this.ContrasenaActual.value !== this.usuariosvc.DatosPersona.dllUsuario[0].contrasena){
            this.mensajerespuestaerror = 'La contraseña actual no es correcta';
            return false;
        }

        return true;

    }

    get ContrasenaActual() { return this.EditarContrasenaForm.get('ContrasenaActual'); }
    get ContrasenaNueva() { return this.EditarContrasenaForm.get('ContrasenaNueva'); }
    get ContrasenaRepetir() { return this.EditarContrasenaForm.get('ContrasenaRepetir'); }










}
