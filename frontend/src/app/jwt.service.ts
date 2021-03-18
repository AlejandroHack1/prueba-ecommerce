import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, forkJoin, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';




@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor(private http: HttpClient) { }



  getData(): Observable<any> {

    let pedidos = this.http.get('http://127.0.0.1:8000/api/list');
    let inventario = this.http.get('http://127.0.0.1:8000/api/inventary');
    



    return forkJoin([pedidos,inventario]);
  }

   // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      //'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
      //'Access-Control-Allow-Origin': '*',

    })
  }
  // Handle API errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        'Backend returned code ${error.status}, ' +
        'body was: ${error.error}');
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

  signUp(data): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/register', data, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }


  logIn(data): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/login', data, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
 

  profile(data): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/user', data)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }


}
