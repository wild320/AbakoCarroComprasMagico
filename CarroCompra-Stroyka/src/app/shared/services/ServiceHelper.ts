import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

import { Observable, throwError } from 'rxjs';
/*
Servicio base, permite ser consumido desde cualquier componente
ToDo. Implementar el put y el delete
*/
@Injectable({
  providedIn: 'root'
})
export class ServiceHelper<T, P> {
  url: string;
  protocol: HttpClient;
  headers: HttpHeaders = new HttpHeaders();

  constructor(http: HttpClient,
              @Inject('BASE_URL') baseUrl: string ) {
    //  this.headers.append('Accept', 'application/json');
    this.headers.append('Content-Type', 'application/json');
    // this.headers.append('Access-Control-Allow-Origin', '*');
    this.protocol = http;
    this.url = baseUrl;
  }

  // Obtiene los datos de un servicio con un get
  // ToDo permitir el get con datos complejos en el body
  getData(requestURL: string, remoteUrl: string = ''): Observable<T> {
    const options = {
      headers: this.headers
    };
    if (remoteUrl !== '') {
      return this.protocol
        .get(remoteUrl + requestURL, options)
        .pipe(map(this.extractData))
        .pipe(catchError(this.handleError));
    } else {
      return this.protocol
        .get(this.url + requestURL, options)
        .pipe(map(this.extractData))
        .pipe(catchError(this.handleError));
    }
  }

  PostData(uri: string, data: P): Observable<T> {
    const options = {
      headers: this.headers
    };
    return this.protocol
      .post(uri, data, options)
      .pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  PutData(uri: string, data: P): Observable<T> {
    const options = {
      headers: this.headers
    };
    return this.protocol
      .put(uri, data, options)
      .pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  DeleteData(uri: string, data: P): Observable<T> {
    return this.protocol
      .delete(uri, data)
      .pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  // Retorna el json de la petición
  private extractData(res: any) {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('Bad response status: ' + res.status);
    }

    return res;
  }
  // Manejador de errores
  private handleError(error: any) {
    const errMsg = error.message || 'Server error';
    console.error('Error al comunicarse al servicio:' + errMsg);
    return throwError(errMsg);
  }

}
