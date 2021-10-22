import { Component, Input } from '@angular/core';
import { FormGroup , FormBuilder, Validators , FormControl} from '@angular/forms';
import { Router } from '@angular/router';


//Servicios
import {PedidosService} from '../../../../shared/services/pedidos.service';

// Contantes
import { EstadoRespuestaMensaje } from '../../../../../data/contantes/cMensajes';

// modelos
import {PedidoSeguimientoResponse } from '../../../../../data/modelos/facturacion/PedidoSeguimientoResponse';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-track-order',
    templateUrl: './page-track-order.component.html',
    styleUrls: ['./page-track-order.component.scss']
})
export class PageTrackOrderComponent {

    public showSteps: boolean = false;
    public TrakingForm: FormGroup;
    public loading: boolean;
    public mensajerespuestaexito: string;
    public mensajerespuestaerror: string;
    private idPedido: any;
    public pedido: any;
    public correo:any;

    public Seguimiento: PedidoSeguimientoResponse[];

    constructor(private fb: FormBuilder,
        private Pedidosvc: PedidosService, 
        private activatedRoute: ActivatedRoute,
          private router: Router
       ) {
           
            this.activatedRoute.params.subscribe(Params => {

                 this.idPedido = Params['id'];
                 
                if (this.idPedido == 0) {
                    this.InitValues();

                    this.inicializarFormulario();
                } else{
                    this.showSteps = true;
                    this.loading = false;

                    this.SetiarMensajes();
                    this.consultarPedido();
                }      
          
              });

       
    }

    consultarPedido(): void{
        this.Pedidosvc.cargarDetallePedido(this.idPedido, 0).then((resp: any) => {
            this.pedido = resp.pedido
            this.correo = resp.direccionEnvio.correo
            this.validarSeguimiento();
        });
    }


    private InitValues(){



        this.showSteps = false;
        this.loading = false;

        this.SetiarMensajes();
    }


    private inicializarFormulario(){

        this.TrakingForm = this.fb.group({
            Pedido: new FormControl('', Validators.compose([Validators.required])),
            Mail: new FormControl('', Validators.compose([Validators.required])),

          });
  
    }

    submitForm(){
        
        this.loading = true;

        if (this.EsValidoFormulario()){
            //Enviar pedido
            this.Pedidosvc.GetDetalleTracking(this.Pedido.value, this.Mail.value).then((ret: any) => {
                
                if (ret.msgId === EstadoRespuestaMensaje.Error ){
                    this.mensajerespuestaerror = ret.msgStr;
                }else{
                    this.showSteps = true;

                    this.Seguimiento = this.Pedidosvc.getpedidoseguimiento()

                }

                this.loading = false;
                

            });


        }

    }

     validarSeguimiento(){

       this.loading = true;
         //Enviar pedido


        
           this.Pedidosvc.GetDetalleTracking(this.pedido, this.correo).then((ret: any) => {
               if (ret.msgId === EstadoRespuestaMensaje.Error ){
                  this.mensajerespuestaerror = ret.msgStr;
              }else{
                  this.showSteps = true;

              this.Seguimiento = this.Pedidosvc.getpedidoseguimiento()

              }

              this.loading = false;
                

            });

     }

    volver(){

        this.showSteps = false;
        this.loading = false;

        if(this.idPedido != 0){
            this.router.navigate([`account/orders`])
        }

    }

    EsValidoFormulario(): boolean{

        // debe tener una direccion selecionada
        if (this.Pedido.invalid){
            this.mensajerespuestaerror = 'Debe ingresar información en el # de pedido.';
            return false;
        }
        
        // debe tener una direccion selecionada
        if (this.Mail.invalid){
            this.mensajerespuestaerror = 'Debe ingresar información en el correo electrónico';
            return false;
        }

        return true;

    }

    SetiarMensajes(){
        this.mensajerespuestaexito = '';
        this.mensajerespuestaerror = '';
    }

    get Pedido() { return this.TrakingForm.get('Pedido'); }
    get Mail() { return this.TrakingForm.get('Mail'); }
}
