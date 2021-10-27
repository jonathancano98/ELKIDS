import { Component, OnInit,ViewChild } from '@angular/core';
import{DbServiceService} from 'src/app/db-service.service';
import { CalculosService } from '../Servicios/calculo.coleccion';
import * as URL from '../URLS/urls';
import { IonSlides } from '@ionic/angular';
import { NavController, IonContent, LoadingController, AlertController } from '@ionic/angular';



@Component({
  selector: 'app-inicio-juego-coleccion',
  templateUrl: './inicio-juego-coleccion.page.html',
  styleUrls: ['./inicio-juego-coleccion.page.scss'],
})

export class InicioJuegoColeccionPage implements OnInit {

  constructor(private dbService:DbServiceService,
              private calculos: CalculosService) { }


              @ViewChild(IonSlides, { static: false }) slides: IonSlides;

              @ViewChild('content', { static: false }) content: IonContent;
 ngOnInit() {}

 ////////////////////////VARIABLES
  alumnoID:any;
  alumno:any;
  id: any;
  juegoseleccionado:any;
  cromosQueTengo:any[]=[];
  cromosSinRepetidos:any[]=[];
  cromosQueNoTengo:any[]=[];
  cromosQueTengoImagenDelante: string[]=[];
  cromosQueTengoImagenDetras: string[]=[];
  cromosQueNoTengoImagenDelante: string[]=[];
  sliderConfig: any;

  preparado = false;
  coleccion:any;

  disablePrevBtn = true;
  disableNextBtn = false;

  async ionViewWillEnter()
  {
  
    
      this.sliderConfig = {slidesPerView: 1.6,spaceBetween: 10,centeredSlides: true};

      this.alumnoID = localStorage.getItem("alumnoID");
      console.log("alumnoID:",this.alumnoID);
      this.alumno= await this.dbService.dameAlumnoporidalumno(this.alumnoID).toPromise();
      console.log("Datos alumno:",this.alumno);

      this.id = localStorage.getItem("idjuegodecoleccion");
      console.log(this.id);
      this.juegoseleccionado = await this.dbService.dameJuegoporidjuego(this.id).toPromise();
      console.log("Datos juego:",this.juegoseleccionado);

      //ColeccionID
      console.log("ColeccionId",this.juegoseleccionado[0].coleccionId);

      this.dbService.DameColeccionPromise(this.juegoseleccionado[0].coleccionId)
      .then(coleccion => this.coleccion=coleccion);
      //this.equipo=this.sesion.DameEquipo();

      if(this.juegoseleccionado[0].Modo === 'Individual' )
      {
         this.DameLosCromosDelAlumno();
      }
}

DameLosCromosDelAlumno() {
  this.dbService.DameInscripcionAlumnoJuegoDeColeccion(this.juegoseleccionado[0].id, this.alumno[0].id)
  .subscribe(InscripcionAlumno => {
                                  this.dbService.DameCromosAlumno(InscripcionAlumno[0].id)
                                  .subscribe(CromosAlumno => {
                                                                console.log('aquí están los cromos: ',CromosAlumno);
                                                                this.cromosQueTengo = CromosAlumno;
                                                                this.cromosSinRepetidos = this.calculos.GeneraListaSinRepetidos(this.cromosQueTengo);
                                                                this.dbService.DameCromosColeccion(this.juegoseleccionado[0].coleccionId)
                                                                .subscribe( todosLosCromos => {
                                                                                                console.log('aqui estan todos los cromos',todosLosCromos);
                                                                                                console.log ('cromos que tengo:',this.cromosQueTengo);
                                                                                                this.cromosQueNoTengo = this.calculos.DameCromosQueNoTengo(this.cromosQueTengo, todosLosCromos);
                                                                                                console.log ('cromos que NO tengo:',this.cromosQueNoTengo);
                                                                                                this.PreparaImagenesCromosQueTengo();
                                                                                                this.PreparaImagenesCromosQueFaltan();
                                                                                                this.preparado = true;
                                                                                                });
                                                               });
                                    });
   }

   PreparaImagenesCromosQueTengo() {
    for (let i = 0; i < this.cromosSinRepetidos.length; i++) {
      const elem = this.cromosSinRepetidos[i];
      this.cromosQueTengoImagenDelante[i] = URL.ImagenesCromo + elem.cromo.ImagenDelante;
      if (this.coleccion.DosCaras) {
        this.cromosQueTengoImagenDetras[i] = URL.ImagenesCromo + elem.cromo.ImagenDetras;
      }
    }
  }

  PreparaImagenesCromosQueFaltan() {
    console.log ('cromos que NO tengo');
    console.log (this.cromosQueNoTengo);
    for (let j = 0; j < this.cromosQueNoTengo.length; j++) {
      const elem = this.cromosQueNoTengo[j];
      this.cromosQueNoTengoImagenDelante[j] = URL.ImagenesCromo + elem.cromo.ImagenDelante;

    }
    console.log ('IMAGENES cromos que NO tengo');
    console.log (this.cromosQueNoTengoImagenDelante);

  }

  doCheck() {
    // Para decidir si hay que mostrar los botones de previo o siguiente slide
    const prom1 = this.slides.isBeginning();
    const prom2 = this.slides.isEnd();

    Promise.all([prom1, prom2]).then((data) => {
      data[0] ? this.disablePrevBtn = true : this.disablePrevBtn = false;
      data[1] ? this.disableNextBtn = true : this.disableNextBtn = false;
    });
  }

}
