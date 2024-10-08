import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {  UntypedFormGroup , UntypedFormBuilder, Validators , UntypedFormControl} from '@angular/forms';

// servicios
import { UsuarioService } from 'src/app/shared/services/usuario.service';

// constantes
import { Crutas } from 'src/data/contantes/cRutas';
import { EstadoRespuestaMensaje } from 'src/data/contantes/cMensajes';

// modelos
import { MaestroCiudad } from 'src/data/modelos/negocio/Ciudades';
import { MaestroBarrios } from 'src/data/modelos/negocio/Barrios';
import { GuardarDireccion } from 'src/data/modelos/negocio/GuardarDireccion';

@Component({
    selector: 'app-page-edit-address',
    templateUrl: './page-edit-address.component.html',
    styleUrls: ['./page-edit-address.component.scss']
})
export class PageEditAddressComponent implements OnInit  {

    public EditarDireccionForm: UntypedFormGroup;
    public mensajerespuestaexito: string;
    public mensajerespuestaerror: string;
    public loading: boolean;
    public ciudadesDepartamento: MaestroCiudad[];
    public BarrioCiudades: MaestroBarrios[];
    private IdDireccion: number;
    private DireccionGuardar = new GuardarDireccion();

    constructor(public usuariosvc: UsuarioService,
                private rutaActiva: ActivatedRoute,
                private router: Router,
                private fb: UntypedFormBuilder){

        this.loading = false;
        this.ciudadesDepartamento = [];

        this.SetiarMensajes();

    }

    ngOnInit() {

        this.EditarDireccionForm = this.fb.group({
            Pais: new UntypedFormControl('', Validators.compose([Validators.required])),
            Departamento: new UntypedFormControl('', Validators.compose([Validators.required])),
            Ciudad: new UntypedFormControl('', Validators.compose([Validators.required])),
            Barrio: new UntypedFormControl('', Validators.compose([Validators.required])),
            Prefijo: new UntypedFormControl('', Validators.compose([Validators.required])),
            CalleCarrera: new UntypedFormControl('', Validators.compose([Validators.required])),
            Direccion: new UntypedFormControl('', Validators.compose([Validators.required])),
            Interior: new UntypedFormControl(''),
            CodigoPostal: new UntypedFormControl(''),

        });

        this.IdDireccion = Number(this.rutaActiva.snapshot.params['addressId']);

        this.CargarMaestros(this.IdDireccion);

    }

    SetiarMensajes(){
        this.mensajerespuestaexito = '';
        this.mensajerespuestaerror = '';
    }

    CargarMaestros(id: number){

        // Cargar maestros de localizacion
        this.usuariosvc.CargarMaestrosLocalizacion();

        // si es indefinido debe recuperar nuevamente los pedidos
        if (this.usuariosvc.DatosPersona.dllDireccion === undefined){

            this.router.navigate([Crutas.MisDirecciones]);

        }

        if  (this.usuariosvc.DatosPersona.dllDireccion !== undefined){

            // saber el index
            const index = this.usuariosvc.DatosPersona.dllDireccion.findIndex( x => x.idDireccion === id);

            if (index >= 0){

                // captutar el id barrio
                const IdBarrio = this.usuariosvc.DatosPersona.dllDireccion[index].idBarrio;

                if (this.usuariosvc.objMaestrosLocalizacion.barrios !== undefined){

                    const indexMaestro = this.usuariosvc.objMaestrosLocalizacion.barrios.findIndex( x => x.dirIdBarr === IdBarrio);

                    let usrDepartamento = '';
                    let usrCiudad = '';

                    if (indexMaestro >= 0){
                        usrDepartamento = this.usuariosvc.objMaestrosLocalizacion.barrios[indexMaestro].departamento;
                        usrCiudad = this.usuariosvc.objMaestrosLocalizacion.barrios[indexMaestro].ciudad;
                    }

                    this.Pais.setValue('Colombia');

                    this.CambiarCiudadDepartamento(usrDepartamento);
                    this.Departamento.setValue(usrDepartamento.toUpperCase());

                    this.CambiarBarrioCiudad(usrCiudad);
                    this.Ciudad.setValue(usrCiudad.toUpperCase());

                    this.Barrio.setValue(IdBarrio);
                    this.Prefijo.setValue(this.usuariosvc.DatosPersona.dllDireccion[index].idPrefijoDireccionUno);
                    this.CalleCarrera.setValue(this.usuariosvc.DatosPersona.dllDireccion[index].parteUno);
                    this.Direccion.setValue(this.usuariosvc.DatosPersona.dllDireccion[index].parteDos);
                    this.Interior.setValue(this.usuariosvc.DatosPersona.dllDireccion[index].parteTres);
                    this.CodigoPostal.setValue(this.usuariosvc.DatosPersona.dllDireccion[index].codigoPostal);

                }

            }
        }
    }

    CambiarCiudadDepartamento(seleccion){
        this.ciudadesDepartamento = this.usuariosvc.ciudad.filter(item => item.departamento === seleccion.toUpperCase()).sort();
    }

    CambiarBarrioCiudad(seleccion){

        this.BarrioCiudades = this.usuariosvc.objMaestrosLocalizacion.barrios.filter(
            item => item.ciudad === seleccion.toUpperCase() &&
            item.departamento === this.Departamento.value.toUpperCase()).sort();
    }

    submitForm(){

        this.loading = true;

        this.SetiarMensajes();

        if (this.EsValidoFormulario()){

            this.DireccionGuardar.Id = this.IdDireccion;
            this.DireccionGuardar.Barrio = Number(this.Barrio.value);
            this.DireccionGuardar.Prefijo = Number(this.Prefijo.value);
            this.DireccionGuardar.CalleCarrera = this.CalleCarrera.value;
            this.DireccionGuardar.Direccion = this.Direccion.value;
            this.DireccionGuardar.Interior = this.Interior.value;
            this.DireccionGuardar.CodigoPostal = this.CodigoPostal.value;
            this.DireccionGuardar.Strbarrio = '';
            this.DireccionGuardar.ciudad = '';
            this.DireccionGuardar.departamento = '';
            this.DireccionGuardar.pais = '';
            this.DireccionGuardar.direccion = '';

            this.usuariosvc.GuardarActualizarDireccion(this.DireccionGuardar).then((ret: any) => {

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

        if (this.Pais.invalid){
            this.mensajerespuestaerror = 'Debe ingresar información valida en Pais';
            return false;
        }

        if (this.Departamento.invalid){
            this.mensajerespuestaerror = 'Debe ingresar información valida en Departamento';
            return false;
        }

        if (this.Ciudad.invalid){
            this.mensajerespuestaerror = 'Debe ingresar información valida en Ciudad';
            return false;
        }

        if (this.Barrio.invalid){
            this.mensajerespuestaerror = 'Debe ingresar información valida en Barrio';
            return false;
        }

        if (this.Prefijo.invalid){
            this.mensajerespuestaerror = 'Debe ingresar información valida en Prefijo';
            return false;
        }

        if (this.CalleCarrera.invalid){
            this.mensajerespuestaerror = 'Debe ingresar información valida en Calle o Carrera';
            return false;
        }

        if (this.Direccion.invalid){
            this.mensajerespuestaerror = 'Debe ingresar información valida en Dirección';
            return false;
        }

        return true;

    }

    get Pais() { return this.EditarDireccionForm.get('Pais'); }
    get Departamento() { return this.EditarDireccionForm.get('Departamento'); }
    get Ciudad() { return this.EditarDireccionForm.get('Ciudad'); }
    get Barrio() { return this.EditarDireccionForm.get('Barrio'); }
    get Prefijo() { return this.EditarDireccionForm.get('Prefijo'); }
    get CalleCarrera() { return this.EditarDireccionForm.get('CalleCarrera'); }
    get Direccion() { return this.EditarDireccionForm.get('Direccion'); }
    get Interior() { return this.EditarDireccionForm.get('Interior'); }
    get CodigoPostal() { return this.EditarDireccionForm.get('CodigoPostal'); }

}
