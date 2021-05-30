import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {RecursoLibro} from '../app/home/clases/recursoLibro';
import{RecursoLibroJuego} from'../app/home/clases/recursoLibroJuego';
import { ResponseContentType, Http} from '@angular/http';
import {Alumnojuegodecuento} from '../app/home/clases/Alumnojuegodecuento';
import{Libro} from '../app/home/clases/libro';
import{imagenEscena}from '../app/home/clases/imagenEscena';
import{juegolibro}from '../app/home/clases/juegolibro';

@Injectable({
  providedIn: 'root'
})
export class DbServiceService {

  private base='http://192.168.1.65:3000';
  //private base='http://localhost:3000';

  private APIUrlhost = 'http://localhost:3000/api/Profesores/8/recursosLibros';
  private APIUrlProfesoresHost =this.base+'/api/Profesores';
  private APIUrlRecursoJuego =this.base+'/api/juegodelibro';
  private APIUrlEscena=this.base+'/api/libro';
  private APIUrlElemento=this.base+'/api/escenas'
  private APIurlImagenesLibrosHost =this.base+'/api/imagenes';
  private APIurlAlumnoJuego = this.base+'/api/alumnojuegodecuento';
  private APIurllibro = this.base+'/api/libro';
  private APIurlAlumnos= this.base+'/api/Alumnos';
  //private APIurlJuegos= this.base +'/api/juegodelibro';
 
  
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

  dameAlumnoPorId (id): Observable<any> {
    return this.http.get<any>(this.APIurlAlumnos + '/' + id);
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

    public postEscena(libroId, escenas: any): Observable<any> {
      return this.http.post<any>(this.APIUrlEscena + '/' + libroId + '/escenas', escenas);

      //http://localhost:3000/api/libro/21/escenas
      //return this.http.post<Libro>(this.APIurlAlumnoJuego + '/' + idalumno + '/Libro', libro);
  
    }

    public postElemento(escenaId, frames: any): Observable<any> {
      return this.http.post<any>(this.APIUrlElemento + '/' + escenaId + '/frames', frames);

      //http://localhost:3000/api/libro/21/escenas
      //return this.http.post<Libro>(this.APIurlAlumnoJuego + '/' + idalumno + '/Libro', libro);
  
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

    public BorraImagenEscena (contenedor, file):Observable<any>{
      return this.http.delete<any>(this.APIurlImagenesLibrosHost + '/' + contenedor + '/files/' + file) ;
    }

    public BorrarFramesDeEscena(escenaId):Observable<any> {

      return this.http.delete<any>(this.APIUrlElemento + '/' + escenaId + '/frames') ;

    }

    public BorrarEscena(escenaId):Observable<any>{

      return this.http.delete<any>(this.APIUrlElemento + '/' + escenaId) ;
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

    public dameAlumnosJuegoDeCuento(idalumno): Observable<any> 
    {
      return this.http.get<any[]>(this.APIurlAlumnoJuego+ '?filter[where][alumnoID]=' + idalumno);

    }

    public dameJuegosDelAlumno(idJuegos): Observable<juegolibro>
    {
      return this.http.get<juegolibro>(this.APIUrlRecursoJuego+ '/'+ idJuegos);


    }




   
}
