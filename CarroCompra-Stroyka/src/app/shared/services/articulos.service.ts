import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

// Contantes
import { CServicios } from 'src/data/contantes/cServicios';

// Servicios
import { UsuarioService } from '../services/usuario.service';
import { NegocioService } from '../../shared/services/negocio.service';

// interfaces
import { NavigationLink } from '../../shared/interfaces/navigation-link';

// Modelos
import {MenuCarroCategoria } from '../../../data/modelos/negocio/MenuCarroCategoria';


@Injectable({
  providedIn: 'root'
})
export class ArticulosService {

  private UrlServicio: string;
  public menu = new Subject<NavigationLink[]>();
  public menuCategorias = new Subject<MenuCarroCategoria[]>();

  constructor(public usuariosvc: UsuarioService,
              private httpClient: HttpClient,
              private negocio: NegocioService,
    ) { }

  setMenu(newValue): void {
    this.menu.next(newValue);
  }

  getMenu(): Observable<NavigationLink[]> {
    return this.menu.asObservable();
  }

  setMenuCategoria(newValue): void {
    this.menuCategorias.next(newValue);
  }

  getMenuCategoria(): Observable<MenuCarroCategoria[]> {
    return this.menuCategorias.asObservable();

  }

  public cargarDepartamentos(){

      this.ConsultarDepartamento(0).then((config: any) => {

        this.usuariosvc.getEstadoLogueo().subscribe((value) => {

            if (value){
              return this.ConsultarDepartamento(this.usuariosvc.Idempresa);
            }else {
              if (this.usuariosvc.Idempresa === 0){
                this.ConsultarDepartamento(0);
              }
            }
        });
      });
   }

  public ConsultarDepartamento(IdEmpresa: number ){
    this.UrlServicio =
        this.negocio.configuracion.UrlServicioCarroCompras +
        CServicios.ApiCarroCompras +
        CServicios.ServivioMenu;

    return this.httpClient.get(this.UrlServicio + '/' + IdEmpresa.toString(), { responseType: 'text' })
        .toPromise()
        .then((config: any) => {

        this.setMenu(JSON.parse(config).menuCarro);
        this.setMenuCategoria(JSON.parse(config).menuCarroCategoria);

        })
        .catch((err: any) => {

          console.log ('Error al consumir servicio:' + err.message);

        });

  }


}
