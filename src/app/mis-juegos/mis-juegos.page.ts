import { Component, OnInit } from '@angular/core';
import{DbServiceService} from 'src/app/db-service.service'
import { Router } from '@angular/router';
import{juegolibro} from '../home/clases/juegolibro'
import { AlertController } from '@ionic/angular';

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

  constructor(private router: Router, private dBservice: DbServiceService, private alertController: AlertController) { }

    async ngOnInit() {

  }

  async ionViewWillEnter()
  {
    //Pedimos a la base de datos todos los juegos a los que pertenece nuestro alumno
    this.listaDeJuegosDeAlumno = await this.dBservice.dameAlumnosJuegoDeCuento(localStorage.getItem("alumnoID")).toPromise();


    console.log("sIIIIII")
    console.log(this.listaDeJuegosDeAlumno);
    
    for(let i=0; i<this.listaDeJuegosDeAlumno.length;i++)
    {
      //pido informacion de cada juego
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

  /**
   * Cuando se selecciona un checkbox, los otros checkbox restantes son desactivados
   * @param x Posición del checkbox seleccionado
   */
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


  /**
   * Vamos al juego seleccionado por el alumno
   */
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

      if(count){ 
        this.listaAuxiliar=[];
        this.contador=0;
        this.router.navigate(['/inicio']);
    }else
    
      this.alertaJuegoNoSeleccionado();

  }

  /**
   * Vuelve al menu-principal
   */
  irMenuPrincipal()
  {
    this.listaAuxiliar=[];
    this.contador=0;
    this.router.navigate(['/menu-principal'])
  }

  /**
   * Alerta que avisa que no se ha seleccionado ningún juego
   */
  async alertaJuegoNoSeleccionado() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'ERROR',
      message: 'Debes seleccionar un juego',
      buttons: ['Aceptar']
    });

    await alert.present();
  }

  /**
   * Pedimos a la base de datos todos los juegos a los que pertenece nuestro alumno
   */
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
