import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../../../shared/services/cart.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { RootService } from '../../../../shared/services/root.service';
import { FormGroup , FormBuilder, Validators , FormControl} from '@angular/forms';

// Servicios
import { UsuarioService } from '../../../../../app/shared/services/usuario.service';
import {StoreService} from '../../../../shared/services/store.service';
import {PedidosService} from '../../../../shared/services/pedidos.service';

// utils
import {UtilsTexto} from '../../../../shared/utils/UtilsTexto';

// Contantes
import { EstadoRespuestaMensaje } from '../../../../../data/contantes/cMensajes';



@Component({
    selector: 'app-checkout',
    templateUrl: './page-checkout.component.html',
    styleUrls: ['./page-checkout.component.scss']
})
export class PageCheckoutComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject();

    public ClientePedidoForm: FormGroup;
    public EsUsuarioLogueado = false;
    public loading: boolean;
    public mensajerespuestaexito: string;
    public mensajerespuestaerror: string;

    constructor(
        private fb: FormBuilder,
        public root: RootService,
        public cart: CartService,
        private utils: UtilsTexto,
        private route: ActivatedRoute,
        private router: Router,
        public usuariosvc: UsuarioService,
        public Store: StoreService,
        private Pedidosvc: PedidosService 
    ) {

        this.loading = false;

        this.inicializarFormulario();

        this.SetiarMensajes();

        // tslint:disable-next-line: deprecation
        this.usuariosvc.getEstadoLoguin$().subscribe((value) => {

            if (value) {
                this.EsUsuarioLogueado = true;
                this.cliente.setValue(this.utils.TitleCase(this.usuariosvc.razonsocial));
            }else{
                this.EsUsuarioLogueado = false;
            }

        });

        // cargar maestro de direcciones
        this.usuariosvc.getDireccionesCargadas$().subscribe((value) => {

            if (value) {
                this.CargarDataUsuario();
            }

        });

    }

    ngOnInit(): void {
        // tslint:disable-next-line: deprecation
        this.cart.quantity$.pipe(takeUntil(this.destroy$)).subscribe(quantity => {
            if (!quantity) {
                this.router.navigate(['../cart'], {relativeTo: this.route}).then();
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

  

    private inicializarFormulario(){

        this.ClientePedidoForm = this.fb.group({
            cliente: new FormControl('', Validators.compose([Validators.required])),
            seldireccion: new FormControl('', Validators.compose([Validators.required])),
            Pais: new FormControl('', Validators.compose([Validators.required])),
            Departamento: new FormControl('', Validators.compose([Validators.required])),
            Ciudad: new FormControl('', Validators.compose([Validators.required])),
            Direccion: new FormControl('', Validators.compose([Validators.required])),
            Telefono: new FormControl('', Validators.compose([Validators.required])),
            Correo: new FormControl('', Validators.compose([Validators.required])),
            Observaciones: new FormControl('', Validators.compose([Validators.required])),

            Terminos: new FormControl('', Validators.compose([Validators.required])),    
            Pasarela: new FormControl('', Validators.compose([Validators.required]))     

          });
  
    }

    private CargarDataUsuario(){


        if (this.usuariosvc.addresses) {
            this.CargaDatosDireccion(0)
        }  

    }

    private CargaDatosDireccion(index: number){

        if (index >= 0){

            this.seldireccion.setValue(this.usuariosvc.addresses[index].Id, {emitEvent: false});
            this.Pais.setValue(this.utils.TitleCase(this.usuariosvc.addresses[index].pais), {emitEvent: false});
            this.Departamento.setValue(this.utils.TitleCase(this.usuariosvc.addresses[index].estado), {emitEvent: false});
            this.Ciudad.setValue(this.utils.TitleCase(this.usuariosvc.addresses[index].ciudad), {emitEvent: false});
            this.Direccion.setValue(this.utils.TitleCase(this.usuariosvc.addresses[index].direccion), {emitEvent: false});
    
            this.Telefono.setValue(this.utils.TitleCase(this.usuariosvc.addresses[index].telefono), {emitEvent: false});
            this.Correo.setValue(this.utils.TitleCase(this.usuariosvc.addresses[index].correo), {emitEvent: false});
    
        }else{

            this.seldireccion.setValue("");
            this.Pais.setValue("");
            this.Departamento.setValue("");
            this.Ciudad.setValue("");
            this.Direccion.setValue("");
    
            this.Telefono.setValue("");
            this.Correo.setValue("");

        }
    }

    CambiarDireccion(seleccion: string){
    
        if (seleccion.length ){

            const index = this.usuariosvc.addresses.findIndex( x => x.Id == Number(seleccion));

            this.CargaDatosDireccion(index);

        }else{
            this.CargaDatosDireccion(-1);
        }

    }

    submitForm(){

        this.loading = true;

        this.SetiarMensajes();

        if (this.EsValidoFormulario()){

            // armar detalle pedido
           
           
            const detalle = this.cart.items.map(elem => (
                {
                    IdArt: elem.product.id,
                    Cant: elem.quantity,
                    UM: elem.product.um,
                    Desc: elem.product.discountPerc,
                    Dct: 0,
                    Vr: 0,
                } 
            ));


            //Enviar pedido
            this.Pedidosvc.CrearPedido(this.usuariosvc.Idempresa, this.usuariosvc.IdPersona, this.Store.configuracionSitio.AgenciaDefaul,
                this.Observaciones.value, this.seldireccion.value, detalle).then((ret: any) => {

                if (ret.estado[0].msgId === EstadoRespuestaMensaje.Error ){
                    this.mensajerespuestaerror = ret.estado[0].msgStr;

                }else{

                    this.mensajerespuestaexito = 'Se ha generado el pedido ' + ret.ped.toString() + ' exitosamente.'  ;

                    this.cart.clearAll();

                    this.Pedidosvc.CargarUltimoPedido(ret.idPed);
   
                }

            });

        }

        this.loading = false;
    }

    SetiarMensajes(){
        this.mensajerespuestaexito = '';
        this.mensajerespuestaerror = '';
    }

    
    validarInventario(){
        this.mensajerespuestaerror = 'Revise su carrito hay productos sin inventario'     
    }
    EsValidoFormulario(): boolean{

        // debe tener una direccion selecionada
        if (this.seldireccion.invalid){
            this.mensajerespuestaerror = 'Debe seleccionar una dirección';
            return false;
        }
        
        // debe tener una direccion selecionada
        if (this.Direccion.invalid){
            this.mensajerespuestaerror = 'Debe seleccionar una dirección';
            return false;
        }

        if (this.Pasarela.invalid){
            this.mensajerespuestaerror = 'Debe seleccionar una pasarela de pago';
            return false;
        }

        if (this.Terminos.invalid){
            this.mensajerespuestaerror = 'Debe aceptar términos y condiciones';
            return false;
        }

        return true;

    }


    redireccionar(){

        this.router.navigate(['/account/addresses/0'])
        
    }

    get cliente() { return this.ClientePedidoForm.get('cliente'); }
    get seldireccion() { return this.ClientePedidoForm.get('seldireccion'); }
    get Pais() { return this.ClientePedidoForm.get('Pais'); }
    get Departamento() { return this.ClientePedidoForm.get('Departamento'); }
    get Ciudad() { return this.ClientePedidoForm.get('Ciudad'); }
    get Direccion() { return this.ClientePedidoForm.get('Direccion'); }
    get Correo() { return this.ClientePedidoForm.get('Correo'); }
    get Telefono() { return this.ClientePedidoForm.get('Telefono'); }
    get Observaciones() { return this.ClientePedidoForm.get('Observaciones'); }
    get Pasarela() { return this.ClientePedidoForm.get('Pasarela'); }
    get Terminos() { return this.ClientePedidoForm.get('Terminos'); }

}
