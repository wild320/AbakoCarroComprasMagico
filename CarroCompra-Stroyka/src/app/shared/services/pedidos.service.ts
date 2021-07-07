import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

import { Order } from '../../shared/interfaces/order';
import { Router } from '@angular/router';

// Servicios
import { NegocioService } from '../../shared/services/negocio.service';
import { ServiceHelper } from '../services/ServiceHelper';
import { ServiciosnegocioService } from '../services/serviciosnegocio.service'

// Contantes
import { CServicios } from '../../../data/contantes/cServicios';
import { Cstring } from '../../../data/contantes/cString';
import { EstadoRespuestaMensaje } from '../../../data/contantes/cMensajes';

// utils
import {UtilsTexto} from '../../shared/utils/UtilsTexto';

// Modelos
import {PedidoRequest } from '../../../data/modelos/facturacion/PedidoRequest';
import {PedidoSeguimientoRequest } from '../../../data/modelos/facturacion/PedidoSeguimientoRequest';
import {PedidoSeguimientoResponse } from '../../../data/modelos/facturacion/PedidoSeguimientoResponse';
import {Mensaje} from '../../../data/modelos/negocio/Mensaje';

// constantes
import { Crutas } from '../../../data/contantes/cRutas';


@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  private UrlServicioPaginas: string;
  private UrlServicioPedido: string;
  private TIPOPEDIDOCOMERCIAL: string = '1'
  private FUENTECARROCOMPRAS: number = 9
  private RecuperarRegistros = Cstring.SI;
  private CantidadPedidos: number;
  private pedidorequest = new PedidoRequest();
  private pedidoseguimientorequest = new PedidoSeguimientoRequest();
  private pedidoseguimiento$ = new Subject<PedidoSeguimientoResponse[]>();
  private pedidoseguimiento: PedidoSeguimientoResponse[];
  private mensaje = new Mensaje();
  public NumeroPaginas: string;
  public PaginaActual: number;
  public orders: Partial <Order>[];
  public ordenactual: Order;


  constructor(private httpClient: HttpClient,
              private servicehelper: ServiceHelper<any, any>,
              private negocio: NegocioService,
              private ServiciosnegocioSVC: ServiciosnegocioService,
              private router: Router,
              private utils: UtilsTexto,
              ) {  }

  public cargarPedidos(Idempresa: number, Pagina: number) {

    this.UrlServicioPaginas = this.negocio.configuracion.UrlServicioCarroCompras +  CServicios.ApiCarroCompras +
    CServicios.ServicioPedidosCliente;


    return this.httpClient.get(this.UrlServicioPaginas
    + '/' + Idempresa.toString() + '/' + Pagina.toString() + '/' + this.RecuperarRegistros, { responseType: 'text' })
      .toPromise()
      .then((resp: any) => {

        // Capturar ordenes
        this.orders = JSON.parse(resp).resultado;

        // Colocar la pagina en la cual se consulto la ultima vez
        this.PaginaActual = Pagina;

        // Capturar numero de ordenes
        if (this.RecuperarRegistros === Cstring.SI) {
          this.CantidadPedidos =  JSON.parse(resp).registros;
          this.NumeroPaginas = Math.ceil(this.CantidadPedidos / 5).toString();
        }

        // cambiar recuperar registros
        this.RecuperarRegistros = Cstring.NO;

        return resp;

      })
      .catch((err: any) => {
          console.error(err);
      });
  }

  public async CargarUltimoPedido(IdPedido: number) {

    if (IdPedido !== undefined){

      const orden = await this.cargarDetallePedido(IdPedido, -1);
  
      if (orden) {
        this.router.navigate([Crutas.succesorder]);
      }

    }  

  }

  public cargarDetallePedido(IdPedido: number, index: number) {

    this.UrlServicioPaginas = this.negocio.configuracion.UrlServicioCarroCompras +  CServicios.ApiCarroCompras +
    CServicios.ServicioDetallePedido;

    return this.httpClient.get(this.UrlServicioPaginas + '/' + IdPedido.toString(), { responseType: 'text' })
        .toPromise()
        .then((resp: any) => {

          if (index !== -1){
            this.orders[index] = JSON.parse(resp);
          }
          
          this.ordenactual = JSON.parse(resp);

          return JSON.parse(resp);

        })
        .catch((err: any) => {
            console.error(err);
        });
  }

  
  getpedidoseguimiento(): PedidoSeguimientoResponse[] {
    return this.pedidoseguimiento;
  }

  setpedidoseguimiento$(newValue){
    this.pedidoseguimiento = newValue;
    this.pedidoseguimiento$.next(newValue);
  }

  getpedidoseguimiento$(): Observable<PedidoSeguimientoResponse[]> {
    return this.pedidoseguimiento$.asObservable();
  }

  public GetDetalleTracking(pedido: number, mail: string) {

    const UrlServicioSeguimiento: string = this.negocio.configuracion.UrlServicioCarroCompras +  CServicios.ApiCarroCompras +
    CServicios.SeguimientoPedido;

    //armar objecto 
    this.pedidoseguimientorequest.idPedido = 0;
    this.pedidoseguimientorequest.pedido = Number(pedido);
    this.pedidoseguimientorequest.correo = mail;

    return this.servicehelper
    .PostData(UrlServicioSeguimiento, this.pedidoseguimientorequest)
    .toPromise()
    .then((config: any) => {

      this.setpedidoseguimiento$(config);

      if ( config == undefined || config.length == 0){

        this.mensaje.msgId = EstadoRespuestaMensaje.Error;
        this.mensaje.msgStr = 'No existen registros para los datos seleccionados';

      }else{

        this.mensaje.msgId = EstadoRespuestaMensaje.exitoso;
        this.mensaje.msgStr = "ok";

      };  

      return this.mensaje;

    })
    .catch((err: any) => {

      this.mensaje.msgId = EstadoRespuestaMensaje.Error;
      this.mensaje.msgStr = 'Error conectando el api: ' + err;

      return this.mensaje;

    });


  }

  public async CrearPedido(idempresa: number, idpersona: number, agencia: string, observacion: string, direccion: number, detalle: any){

    // recuperar la hora y fecha la servidor
    const fecha = await  this.ServiciosnegocioSVC.RecuperarFechayHora()

      // debe ser un pedido valido
    if (fecha !== undefined ){

        // armar pedido
        this.ArmarObjectoPedido(idempresa, idpersona, agencia, observacion, direccion, fecha, detalle);

        return this.EnviarPedido(this.pedidorequest).then((ret: any) => {
    
          return ret;
    
        });
    }  
   
  }

  private ArmarObjectoPedido(idempresa: number, idpersona: number, agencia: string, observacion: string, direccion: number, fecha: string, detalle: any){

    this.pedidorequest.IdEmp = idempresa ;
    this.pedidorequest.Tp = this.TIPOPEDIDOCOMERCIAL;
    this.pedidorequest.OtDcto = 0;
    this.pedidorequest.Obs = observacion;
    this.pedidorequest.cnt = idpersona;
    this.pedidorequest.Usr = idpersona;
    this.pedidorequest.Fnt = this.FUENTECARROCOMPRAS;
    this.pedidorequest.Dir = direccion;
    this.pedidorequest.Fcent = fecha;
    this.pedidorequest.Fc = fecha;
    this.pedidorequest.Agn = agencia;
    this.pedidorequest.Lon = this.ServiciosnegocioSVC.longitude;
    this.pedidorequest.Lat = this.ServiciosnegocioSVC.latitude;
    this.pedidorequest.Rfv = this.utils.newGuid();
    this.pedidorequest.Dll = detalle;

  }
  
  private EnviarPedido(request: PedidoRequest){
  
    this.UrlServicioPedido =
          this.negocio.configuracion.UrlServicioCarroCompras +
          CServicios.ApiCarroCompras +
          CServicios.InsertarPedidoF000;
  
      return this.servicehelper
        .PostData(this.UrlServicioPedido, request)
        .toPromise()
        .then((config: any) => {

          return config;
  
        })
        .catch((err: any) => {
  
          this.mensaje.msgId = EstadoRespuestaMensaje.Error;
          this.mensaje.msgStr = 'Error conectando el api: ' + err;
  
          return this.mensaje;
  
        });
    
  }

}
