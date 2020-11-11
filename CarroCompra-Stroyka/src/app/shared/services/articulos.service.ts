import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Contantes
import { CServicios } from 'src/data/contantes/cServicios';

// Servicios
import { UsuarioService } from '../services/usuario.service';
import { NegocioService } from '../../shared/services/negocio.service';

// interfaces
import { NavigationLink } from '../../shared/interfaces/navigation-link';


@Injectable({
  providedIn: 'root'
})
export class ArticulosService {

  private UrlServicio: string;
  public menu: NavigationLink[];

  constructor(public usuariosvc: UsuarioService,
              private httpClient: HttpClient,
              private negocio: NegocioService,
    ) { }


  public cargarDepartamentos(){

      this.ConsultarDepartamento(0).then((config: any) => {

        this.usuariosvc.getEstadoLogueo().subscribe((value) => {

            if (value){
              return this.ConsultarDepartamento(this.usuariosvc.Idempresa).then((conf: any) => { });
            }else {
              if (this.usuariosvc.Idempresa === 0){
                this.ConsultarDepartamento(0).then((configu: any) => {});
              }
            }
        });

      });

      console.log (this.menu);

  }

  private ConsultarDepartamento(IdEmpresa: number ): Promise<void> {
    this.UrlServicio =
        this.negocio.configuracion.UrlServicioCarroCompras +
        CServicios.ApiCarroCompras +
        CServicios.ServivioMenu;

    return this.httpClient.get(this.UrlServicio + '/' + IdEmpresa.toString(), { responseType: 'text' })
        .toPromise()
        .then((config: any) => {

          this.menu = JSON.parse(config).menuCarro;

        })
        .catch((err: any) => {

          console.log ('Error al consumir servicio:' + err.message);

        });

  }


}
