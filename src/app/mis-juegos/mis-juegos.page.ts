import { Component, OnInit } from '@angular/core';
import{DbServiceService} from 'src/app/db-service.service'
import { Router } from '@angular/router';
import{juegolibro} from '../home/clases/juegolibro'

@Component({
  selector: 'app-mis-juegos',
  templateUrl: './mis-juegos.page.html',
  styleUrls: ['./mis-juegos.page.scss'],
})
export class MisJuegosPage implements OnInit {

  listaDeJuegosDeAlumno: any[] = [];
  lista:  juegolibro;
  listaAuxiliar:  juegolibro[] = [];
  seleccionado: boolean[];
  categorias: boolean[];
  contador: number = 0;

  constructor(private router: Router, private dBservice: DbServiceService) { }

    async ngOnInit() {

    //await this.obtengoAlumnos()
    
    this.listaDeJuegosDeAlumno = await this.dBservice.dameAlumnosJuegoDeCuento(localStorage.getItem("alumnoID")).toPromise();


    console.log("sIIIIII")
    console.log(this.listaDeJuegosDeAlumno);
    
    for(let i=0; i<this.listaDeJuegosDeAlumno.length;i++)
    {
      this.lista = await this.dBservice.dameJuegosDelAlumno(this.listaDeJuegosDeAlumno[i].juegoId).toPromise();
      console.log("me llega lista")
      console.log(this.lista);
      this.listaAuxiliar.push(this.lista);
      this.seleccionado = Array(this.listaAuxiliar.length).fill(false);
      this.categorias = Array(this.listaAuxiliar.length).fill(false);

    }



    console.log(this.listaAuxiliar);
    console.log(this.seleccionado);
  
  }

//buscar el elemento que tenga la clase checkbox xD
  selection(x: any) {

    this.contador++;
    for(let i=0 ; i<this.seleccionado.length ; i++)
    {
      if(i!==x)
      {
        this.categorias[i]= !this.categorias[i];
        this.seleccionado[i]=false;
      }
      else 
      {
        if(this.contador%2==0) this.seleccionado[i]=false;
        else this.seleccionado[i]=true;
      }

    }    
    console.log("seleccionados")
    console.log(this.seleccionado);
  }


  irJuego()
  {

    let count: boolean;
    count = false;
  
    console.log(this.seleccionado);

      for(let i = 0; i < this.seleccionado.length; i++)
      {
        if(this.seleccionado[i])
        {
          localStorage.setItem("idAlumnoJuego", this.listaDeJuegosDeAlumno[i].id);
          count = true;
          //this.router.navigate(['/menu-libro']);

        }



      }

      if(count) this.router.navigate(['/inicio']);




  }

  irMenuPrincipal()
  {
    this.router.navigate(['/menu-principal'])
  }






 async obtengoAlumnos(){

    this.dBservice.dameAlumnosJuegoDeCuento(localStorage.getItem("alumnoID")).subscribe ( juegos => {

      if (juegos.length != 0){

        console.log(juegos);
        this.listaDeJuegosDeAlumno = juegos;       
        console.log(this.listaDeJuegosDeAlumno);
      }
      else console.log("no tiene juegos disponibles");



                            }
                );


  }



}
