import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {RecursoLibro} from '../app/home/clases/recursoLibro';
import{RecursoLibroJuego} from'../app/home/clases/recursoLibroJuego';
import { ResponseContentType, Http} from '@angular/http';
import {Alumnojuegodecuento} from '../app/home/clases/Alumnojuegodecuento';
import{Libro} from '../app/home/clases/libro';
import{imagenEscena}from '../app/home/clases/imagenEscena';

@Injectable({
  providedIn: 'root'
})
export class DbServiceService {

  private APIUrlhost = 'http://localhost:3000/api/Profesores/8/recursosLibros';
  private APIUrlProfesoresHost ='http://localhost:3000/api/Profesores';
  private APIUrlRecursoJuego ='http://localhost:3000/api/juegodelibro';
  private APIUrlEscena='http://localhost:3000/api/escenas';
  private APIurlImagenesLibrosHost ='http://localhost:3000/api/imagenes';
  private APIurlAlumnoJuego = 'http://localhost:3000/api/alumnojuegodecuento';
  private APIurllibro = 'http://localhost:3000/api/libro';
  private APIurlAlumnos= 'http://localhost:3000/api/Alumnos';
 
  
  private APIUrl = 'http://147.83.249.79:3000/api/Profesores/8/recursosLibros';
  private APIUrlProfesores='http://147.83.249.79:3000/api/Profesores';
  private APIurlImagenesLibros='http://147.83.249.79:3000/api/imagenes';
  constructor(private http: HttpClient,private httpImagenes: Http ) {}

  dameAlumno (nombre: string): Observable<any> {
    return this.http.get<any>(this.APIUrl + '/' + nombre);
  }

  public loginAlumno(username: string, password: string): Observable<any> {
    console.log('Entro a mostrar a ' + username + ' ' + password);
    return this.http.get<any>(this.APIurlAlumnos + '?filter[where][Username]=' + username + '&filter[where][Password]=' + password);
  }


    recuperarListaRecursos(profesorId): Observable<RecursoLibro[]> {
      return this.http.get<RecursoLibro[]>(this.APIUrlProfesoresHost  + '/' + profesorId + '/recursosLibros');
    }



    recuperarListaRecursosJuego(juegoId):Observable<RecursoLibroJuego[]>{
      return this.http.get<RecursoLibroJuego[]>(this.APIUrlRecursoJuego  + '/' + juegoId +'/recursosJuegoLibro');

    }

    obtenerImagenesEscena(nombreCuento):Observable<imagenEscena[]>{
      return this.http.get<imagenEscena[]>(this.APIurlImagenesLibrosHost  + '/' + nombreCuento +'/files');

    }


    public crearCarpeta (name: any): Observable<any> {
      return this.http.post<any>(this.APIurlImagenesLibrosHost, name);
  
    }

    public postEscena(escena: any): Observable<any> {
      return this.http.post<any>(this.APIUrlEscena + '/' + escena.id, escena);
  
    }

    /**
     * 
     * @param containerName 
     * @param fileName 
     * @returns 
     */
    public getImagenesRecurso(containerName, fileName): Observable<any> {
      return this.httpImagenes.get(this.APIurlImagenesLibrosHost  + '/' + containerName + '/download/' + fileName, { responseType: ResponseContentType.Blob });
    }

    public getEscenasDeRecurso(containerName, fileName): Observable<any> {
      return this.httpImagenes.get(this.APIurlImagenesLibrosHost  + '/' + containerName + '/download/' + fileName, { responseType: ResponseContentType.Blob });
    }
    /**
     * @brief 
     * @param id 
     * @returns 
     */
    public dameAlumnoJuegoLibro(id): Observable<any>  {
      return this.http.get<Alumnojuegodecuento>(this.APIurlAlumnoJuego+ '/' + id);
      
     }

     public dameAlumnoJuego(id): Observable<any> {
      return this.http.get<any>(this.APIurlAlumnoJuego+ '/' + id);
    }

    public postImage(contenedor: string, formData: FormData): Observable<any> {
      return this.http.post<any>(this.APIurlImagenesLibrosHost + '/' + contenedor + '/upload', formData);
  
    }



     public comprobarTituloLibro(nombre: string){
      return this.http.get<any>(this.APIurllibro + '?filter[where][titulo]=' + nombre);
    
    }
    public publicarlibro(idalumno: string, libro: Libro): Observable<Libro> {
      return this.http.post<Libro>(this.APIurlAlumnoJuego + '/' + idalumno + '/Libro', libro);
    }

    //arreglar esta funcion, conseguir que me pase esa lista
    public dameLibrosAlumnoJuego(idalumno): Observable<any> 
    {
      return this.http.get<any[]>(this.APIurllibro+ '?filter[where][idAlumno]=' + idalumno);

    }


   
}
