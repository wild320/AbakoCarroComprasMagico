import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../../shared/interfaces/order';

// Servicios
import { NegocioService } from '../../shared/services/negocio.service';

// Contantes
import { CServicios } from '../../../data/contantes/cServicios';
import { Cstring } from '../../../data/contantes/cString';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  private UrlServicioPaginas: string;
  public orders: Partial <Order>[];
  public ordenactual: Order;
  private CantidadPedidos: number;
  public NumeroPaginas: string;
  public PaginaActual: number;
  private RecuperarRegistros = Cstring.SI;

  constructor(private httpClient: HttpClient,
              private negocio: NegocioService) {

  }


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

    public cargarDetallePedido(pedido: number) {

      this.UrlServicioPaginas = this.negocio.configuracion.UrlServicioCarroCompras +  CServicios.ApiCarroCompras +
      CServicios.ServicioDetallePedido;

      // sacar el numero de pedido
      const index = this.orders.findIndex( x => x.pedido === pedido);

      const IdPedido =  this.orders[index].idPedido;

      return this.httpClient.get(this.UrlServicioPaginas + '/' + IdPedido.toString(), { responseType: 'text' })
          .toPromise()
          .then((resp: any) => {

            this.orders[index] = JSON.parse(resp);

            this.ordenactual = JSON.parse(resp);

            return JSON.parse(resp);

          })
          .catch((err: any) => {
              console.error(err);
          });
    }

}
