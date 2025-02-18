import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject, firstValueFrom } from 'rxjs';

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
import { UtilsTexto } from '../../shared/utils/UtilsTexto';

// Modelos
import { PedidoRequest } from '../../../data/modelos/facturacion/PedidoRequest';
import { PedidoSeguimientoRequest } from '../../../data/modelos/facturacion/PedidoSeguimientoRequest';
import { PedidoSeguimientoResponse } from '../../../data/modelos/facturacion/PedidoSeguimientoResponse';
import { Mensaje } from '../../../data/modelos/negocio/Mensaje';

// constantes
import { Crutas } from '../../../data/contantes/cRutas';


@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  private UrlServicioPaginas: string;
  private UrlServicioPedido: string;
  private UrlServicioAnular: string
  private TIPOPEDIDOCOMERCIAL: string = '1'
  private FUENTECARROCOMPRAS: number = 9
  private RecuperarRegistros = Cstring.SI;
  private CantidadPedidos: number;
  private pedidorequest = new PedidoRequest();
  private pedidoseguimientorequest = new PedidoSeguimientoRequest();
  private pedidoseguimiento$ = new Subject<PedidoSeguimientoResponse[]>();
  private pedidoseguimiento: PedidoSeguimientoResponse[];
  private mensaje = new Mensaje();
  public NumeroPaginas: number = 0;
  public PaginaActual: number;
  public orders: Partial<Order>[];
  public ordenactual: Order;


  constructor(private httpClient: HttpClient,
    private servicehelper: ServiceHelper<any, any>,
    private negocio: NegocioService,
    private ServiciosnegocioSVC: ServiciosnegocioService,
    private router: Router,
    private utils: UtilsTexto,
  ) { }


  public cargarPedidos(Idempresa: number, Pagina: number): Promise<any> {
    // Construir la URL del servicio
    this.UrlServicioPaginas =
      `${this.negocio.configuracion.UrlServicioCarroCompras}${CServicios.ApiCarroCompras}${CServicios.ServicioPedidosCliente}`;

    // Llamar al servicio HTTP
    return firstValueFrom(
      this.httpClient.get(`${this.UrlServicioPaginas}/${Idempresa}/${Pagina}/${this.RecuperarRegistros}`)
    )
      .then((resp: any) => {
        if (resp) {
          // Capturar ordenes
          this.orders = resp.resultado;

          // Actualizar la página actual
          this.PaginaActual = Pagina;

          // Capturar el número de órdenes y calcular las páginas si corresponde
          if (this.RecuperarRegistros === Cstring.SI) {
            this.CantidadPedidos = resp.registros;
            this.NumeroPaginas = Math.ceil(this.CantidadPedidos / 5);
          }

          // Cambiar la configuración de registros a recuperar
          this.RecuperarRegistros = Cstring.NO;
        }

        return resp;
      })
      .catch((err: any) => {
        console.error('Error al cargar los pedidos:', err);
        throw err; // Propagar el error para que pueda manejarse en el llamador
      });
  }


  public async CargarUltimoPedido(IdPedido: number, pasarela: string): Promise<void> {
    if (IdPedido === undefined || IdPedido === null) {
      return;
    }

    try {

      const orden = await this.cargarDetallePedido(IdPedido, -1, pasarela);

      if (orden) {
        this.router.navigate([Crutas.succesorder]);
      }
    } catch (error) {
      console.error('Error al cargar el último pedido:', error);
    }
  }



  public async cargarDetallePedido(IdPedido: number, index: number, pasarela?: string): Promise<any> {
    try {
      const url = `${this.negocio.configuracion.UrlServicioCarroCompras}${CServicios.ApiCarroCompras}${CServicios.ServicioDetallePedido}/${IdPedido}`;

      const resp = await firstValueFrom(this.httpClient.get<any>(url));

      if (index !== -1) {
        this.orders[index] = resp;
      }
      this.ordenactual = resp;
      this.ordenactual.metodoPago = pasarela;

      return resp;
    } catch (error) {
      throw error;
    }
  }




  getpedidoseguimiento(): PedidoSeguimientoResponse[] {
    return this.pedidoseguimiento;
  }

  setpedidoseguimiento$(newValue) {
    this.pedidoseguimiento = newValue;
    this.pedidoseguimiento$.next(newValue);
  }

  getpedidoseguimiento$(): Observable<PedidoSeguimientoResponse[]> {
    return this.pedidoseguimiento$.asObservable();
  }

  public GetDetalleTracking(idPedido: number, pedido: number, mail: string) {

    const UrlServicioSeguimiento: string = this.negocio.configuracion.UrlServicioCarroCompras + CServicios.ApiCarroCompras +
      CServicios.SeguimientoPedido;

    //armar objecto 
    this.pedidoseguimientorequest.idPedido = Number(idPedido);
    this.pedidoseguimientorequest.pedido = Number(pedido);
    this.pedidoseguimientorequest.correo = mail;

    return this.servicehelper
      .PostData(UrlServicioSeguimiento, this.pedidoseguimientorequest)
      .toPromise()
      .then((config: any) => {

        this.setpedidoseguimiento$(config);

        if (config == undefined || config.length == 0) {

          this.mensaje.msgId = EstadoRespuestaMensaje.Error;
          this.mensaje.msgStr = 'No existen registros para los datos seleccionados';

        } else {

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

  public async CrearPedido(idempresa: number, idpersona: number, idAsesor: number, agencia: string, observacion: string, direccion: number, detalle: any) {

    // recuperar la hora y fecha la servidor
    const fecha = await this.ServiciosnegocioSVC.recuperarFechayHora()

    // debe ser un pedido valido
    if (fecha !== undefined) {

      // armar pedido
      this.ArmarObjectoPedido(idempresa, idpersona, idAsesor, agencia, observacion, direccion, fecha, detalle);

      return this.EnviarPedido(this.pedidorequest).then((ret: any) => {

        return ret;

      });
    }

  }

  private ArmarObjectoPedido(idempresa: number, idpersona: number, idAsesor: number,
    agencia: string, observacion: string, direccion: number, fecha: string, detalle: any) {

    this.pedidorequest.IdEmp = idempresa;
    this.pedidorequest.Tp = this.TIPOPEDIDOCOMERCIAL;
    this.pedidorequest.OtDcto = 0;
    this.pedidorequest.Obs = observacion;
    this.pedidorequest.cnt = idpersona;
    this.pedidorequest.Usr = idAsesor;
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

  private EnviarPedido(request: PedidoRequest) {

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

  public anularPedido(parameter) {

    this.UrlServicioAnular = this.negocio.configuracion.UrlServicioCarroCompras + CServicios.ApiCarroCompras + CServicios.ServicioAnular;

    return this.httpClient.post(this.UrlServicioAnular, parameter)
      .toPromise()
      .catch((err: any) => {
        console.error(err);
      });
  }



}
