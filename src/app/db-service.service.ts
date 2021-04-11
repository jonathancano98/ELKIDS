import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {RecursoLibro} from '../app/home/clases/recursoLibro';
import{RecursoLibroJuego} from'../app/home/clases/recursoLibroJuego';
import { ResponseContentType, Http} from '@angular/http';
import {Alumnojuegodecuento} from '../app/home/clases/Alumnojuegodecuento';
import{Libro} from '../app/home/clases/libro';

@Injectable({
  providedIn: 'root'
})
export class DbServiceService {

  private APIUrlhost = 'http://localhost:3000/api/Profesores/8/recursosLibros';
  private APIUrlProfesoresHost ='http://localhost:3000/api/Profesores';
  private APIUrlRecursoJuego ='http://localhost:3000/api/juegodelibro';

  private APIurlImagenesLibrosHost ='http://localhost:3000/api/imagenes';
  private APIurlAlumnoJuego = 'http://localhost:3000/api/alumnojuegodecuento';
  private APIurllibro = 'http://localhost:3000/api/libro';
 
  
  private APIUrl = 'http://147.83.249.79:3000/api/Profesores/8/recursosLibros';
  private APIUrlProfesores='http://147.83.249.79:3000/api/Profesores';
  private APIurlImagenesLibros='http://147.83.249.79:3000/api/imagenes';
  constructor(private http: HttpClient,private httpImagenes: Http ) {}

    recuperarListaRecursos(profesorId): Observable<RecursoLibro[]> {
      return this.http.get<RecursoLibro[]>(this.APIUrlProfesoresHost  + '/' + profesorId + '/recursosLibros');
    }

    recuperarListaRecursosJuego(juegoId):Observable<RecursoLibroJuego[]>{
      return this.http.get<RecursoLibroJuego[]>(this.APIUrlRecursoJuego  + '/' + juegoId +'/recursosJuegoLibro');

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
