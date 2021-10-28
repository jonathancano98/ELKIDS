import { Component, OnInit,ViewChild } from '@angular/core';
import{DbServiceService} from 'src/app/db-service.service';
import { CalculosService } from '../Servicios/calculo.coleccion';
import * as URL from '../URLS/urls';
import { IonSlides } from '@ionic/angular';
import { NavController, IonContent, LoadingController, AlertController } from '@ionic/angular';
 import { SesionService } from '../Servicios/sesion.service'; 
import { Router } from '@angular/router';




@Component({
  selector: 'app-inicio-juego-coleccion',
  templateUrl: './inicio-juego-coleccion.page.html',
  styleUrls: ['./inicio-juego-coleccion.page.scss'],
})

export class InicioJuegoColeccionPage implements OnInit {

  constructor(private dbService:DbServiceService,
              private calculos: CalculosService,
              private alertCtrl: AlertController,
              private sesion: SesionService,
              private navCtrl: NavController,
              private router: Router


) { }


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
  cromosQueNoTengoImagenDetras: string[]=[];

  sliderConfig: any;

  preparado = false;
  coleccion:any;

  disablePrevBtn = true;
  disableNextBtn = false;

  alumnosJuegoDeColeccion: any[]=[];
  equiposJuegoDeColeccion: any[] = [];
  equipo: any;

  ElegirYRegalarCromo;

  elem: any;
  pos: number;
  progress = 0;
  protected interval: any;


  async ionViewWillEnter()
  {
  
    
      this.sliderConfig = {slidesPerView: 1.6,spaceBetween: 10,centeredSlides: true};

      this.alumnoID = localStorage.getItem("alumnoID"); // 136
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
      
      else {
        this.DameLosCromosDelEquipo ();
  
      }

      if (this.juegoseleccionado[0].Modo === 'Individual') {
        this.dbService.DameAlumnosJuegoDeColeccion(this.juegoseleccionado[0].id)
        .subscribe (alumnos => {
                                this.alumnosJuegoDeColeccion = alumnos;
                                // quito de la lista al alumno que hace el regalo
                                this.alumnosJuegoDeColeccion = this.alumnosJuegoDeColeccion.filter (alumno => alumno.id !== this.alumno.id);
                               });
      }

      else if ((this.juegoseleccionado[0].Modo === 'Equipos') && (this.juegoseleccionado[0].Asignacion === 'Equipo')) {
        this.dbService.DameEquiposJuegoDeColeccion(this.juegoseleccionado[0].id)
        .subscribe (equipos => {
                                this.equiposJuegoDeColeccion = equipos;
                                // quito de la lista al equipo que hace el regalo
                                this.equiposJuegoDeColeccion = this.equiposJuegoDeColeccion.filter (equipo => equipo.id !== this.equipo.id);
                              });
      }

      else {
        // se trata de un juego de equipo pero con asignación individual
        // recuperamos los alumnos del grupo
        this.dbService.DameAlumnosGrupo(this.juegoseleccionado[0].grupoId)
        .subscribe (alumnos => {
              this.alumnosJuegoDeColeccion = alumnos;
              // quito de la lista al alumno que hace el regalo
              this.alumnosJuegoDeColeccion = this.alumnosJuegoDeColeccion.filter (alumno => alumno.id !== this.alumno.id);
        });
      }

      //////Bien Corregio
      this.ElegirYRegalarCromo = (cromo: any) => {
        return new Promise<boolean>((resolve, reject) => {
          const misInputs: any [] = [];
  
          if (this.juegoseleccionado[0].Modo === 'Individual') {

            console.log("Modo Juego seleccionado:",this.juegoseleccionado[0].Modo);
            // preparo las opciones para el radio selector
            this.alumnosJuegoDeColeccion.forEach (alumno => {
              const input = {
                type: 'radio',
                label: alumno.Nombre + ' ' + alumno.PrimerApellido + ' ' + alumno.SegundoApellido,
                value: alumno.id,
                checked: false
              };
              misInputs.push (input);
              console.log("Mis inputs:",misInputs);
            });
            misInputs[0].checked = true; // la primera opción está marcada por defecto
            this.alertCtrl.create({
              cssClass: 'my-custom-class',
              header: 'Elige a quién quieres regalar el cromo',
              inputs : misInputs,
              buttons: [
                {
                  text: 'Cancelar',
                  role: 'cancel',
                  cssClass: 'secondary',
                  handler: () => {
                    console.log('Me arrepiento');
                    // El alumno se ha arrepentido. Resuelvo la promise retornando falso
                    resolve (false);
                  }
                }, {
                  text: 'Ok',
                  handler: async (destinatarioId) => {
                    console.log("DestinatarioId:",destinatarioId);
                    // recibo el id del alumno destinatorio del cromo
                    console.log("Datos RegalaCromoAlumnos","Cromo:",cromo,"Id Destino:", destinatarioId,"Alumno ID:", this.alumnoID,"Juego seleccionado:" ,this.juegoseleccionado[0]);
                    
                    this.calculos.RegalaCromoAlumnos(cromo, destinatarioId, this.alumnoID, this.juegoseleccionado[0]);
                    const alert2 = await this.alertCtrl.create({
                        cssClass: 'my-custom-class',
                        header: 'Cromo regalado con éxito',
                        buttons: ['OK']
                    }).then (res => res.present());
                    // resuelvo indicando que si se ha hecho el regalo
                    resolve (true);
                  }
                }
              ]
            }).then (res => res.present());
  
          } 
          
          ///////////////////////////////MODO EQUIPOS

          else if ((this.juegoseleccionado[0].Modo === 'Equipos') && (this.juegoseleccionado[0].Asignacion === 'Equipo')) {
            // preparo las opciones para el radio selector
            this.equiposJuegoDeColeccion.forEach (equipo => {
              const input = {
                type: 'radio',
                label: equipo.Nombre,
                value: equipo.id,
                checked: false
              };
              misInputs.push (input);
            });
            misInputs[0].checked = true; // la primera opción está marcada por defecto
            this.alertCtrl.create({
              cssClass: 'my-custom-class',
              header: 'Elige a qué equipo quieres regalar el cromo',
              inputs : misInputs,
              buttons: [
                {
                  text: 'Cancelar',
                  role: 'cancel',
                  cssClass: 'secondary',
                  handler: () => {
                    console.log('Me arrepiento');
                    resolve (false);
  
                  }
                }, {
                  text: 'Ok',
                  handler: async (destinatarioId) => {
                    // recibo el id del alumno destinatorio del cromo
                    this.calculos.RegalaCromoEquipos(cromo, destinatarioId, this.equipo.id, this.juegoseleccionado[0]);
                    this.alertCtrl.create({
                        cssClass: 'my-custom-class',
                        header: 'Cromo regalado con éxito',
                        buttons: ['OK']
                    }).then (res => res.present());
                    resolve (true);
                  }
                }
              ]
            }).then (res => res.present());
  
  
  
          } 
          
          else {
            // Juego en equipo pero con asignación individual
            // preparo las opciones para el radio selector
            this.alumnosJuegoDeColeccion.forEach (alumno => {
              const input = {
                type: 'radio',
                label: alumno.Nombre + ' ' + alumno.PrimerApellido + ' ' + alumno.SegundoApellido,
                value: alumno.id,
                checked: false
              };
              misInputs.push (input);
            });
            misInputs[0].checked = true; // la primera opción está marcada por defecto
            this.alertCtrl.create({
              cssClass: 'my-custom-class',
              header: 'Elige a quién quieres regalar el cromo',
              inputs : misInputs,
              buttons: [
                        {
                          text: 'Cancelar',
                          role: 'cancel',
                          cssClass: 'secondary',
                          handler: () => {
                            console.log('Me arrepiento');
                            resolve (false);
                          }
                        }, {
                          text: 'Ok',
                          handler: async (destinatarioId) => {
                            // recibo el id del alumno destinatorio del cromo
                            this.calculos.RegalaCromoAlumnoEquipo(cromo, destinatarioId, this.alumno.id, this.juegoseleccionado[0]);
                            this.alertCtrl.create({
                                cssClass: 'my-custom-class',
                                header: 'Cromo regalado con éxito',
                                buttons: ['OK']
                            }).then (res => res.present());
                            resolve (true);
                          }
                        }
                      ]
            }).then (res => res.present());
          }
  
        });
      };

    ///////////////////////////////MODO EQUIPOS

}

// Interval function

onPress(elem, i) {
  this.elem = elem;
  console.log("Elemento: ",elem);
  this.pos = i;
  console.log("Posicion:",i);
  this.startInterval();
}

onPressUp() {

   this.stopInterval();
}

startInterval() {
  console.log("HOLAAAA")
  const self = this;
  // tslint:disable-next-line:only-arrow-functions
  this.interval = setInterval(function() {
      self.progress = self.progress + 1;
      if (self.progress === 5) {
         self.stopInterval();
         self.progress = 0;
         self.RegalarCromo (self.elem, self.pos);
      }
  }, 1000);
}

stopInterval() {
  clearInterval(this.interval);
}

 MostrarAlbum() {
   
  this.sesion.TomaColeccion (this.coleccion);
  this.sesion.TomaCromos (this.cromosQueTengo);
         
    this.router.navigate(['/album-alumno']);

 }


async  RegalarCromo(elem, i) {
  // elem tiene el cromo y el número de repeticiones
  // i es la posición en el vector de cromos, para facilitar su eliminación
  if (elem.rep === 1) {
    console.log("Elemento no repetido:",elem);
    this.alertCtrl.create({
      header: '¿Seguro que quieres regalar el cromo?',
      message: 'No lo tienes repetido. Te vas a quedar sin él',
      buttons: [
        {
          text: 'SI',
          handler: async () => {
            //aqui es donde hago la llamada a la promise y le indico lo que quiero hacer cuando 
            // se resuelva. El resultado que me emitirá es un booleano que indica si el regalo se ha hecho o no.
            

            this.ElegirYRegalarCromo(elem.cromo).then (regalado => {
              if (regalado) {
                // Como ha regalado el cromo y era la única copia que tenía de ese cromo
                // tengo que cambiar las listas de cromos que tengo y que no tengo, y las listas
                // con las imágenes

                 this.cromosSinRepetidos = this.cromosSinRepetidos.filter (e => e.cromo.id !== elem.cromo.id);
                 console.log("Cromos sin repetir:",this.cromosSinRepetidos,);
                 this.cromosQueTengoImagenDelante.splice (i , 1);
                 if (this.coleccion.DosCaras) {
                    this.cromosQueTengoImagenDetras.splice (i, 1);
                  }
                 elem.rep = 0; // me quedo sin copias de ese cromo
                 this.cromosQueNoTengo.push (elem);
                 this.cromosQueNoTengoImagenDelante.push ( URL.ImagenesCromo + elem.cromo.ImagenDelante);
                 if (this.coleccion.DosCaras)  {
                    this.cromosQueNoTengoImagenDetras.push ( URL.ImagenesCromo + elem.cromo.ImagenDetras);
                }
                 this.cromosQueTengo = this.cromosQueTengo.filter (c => c.id !== elem.cromo.id);
              }
            });
          }
        }, {
          text: 'NO',
          role: 'cancel',
          handler: () => {
            console.log('No regalo');
          }
        }
      ]
    }).then (res => res.present());
  } else {
    this.alertCtrl.create({
      header: '¿Seguro que quieres regalar el cromo?',
      message: 'Tienes ' + elem.rep + ' copias de este cromo.',
      buttons: [
        {
          text: 'SI',
          handler: async () => {
            this.ElegirYRegalarCromo(elem.cromo).then (regalado => {
              if (regalado) {
                // como se ha regalado el cromo tomo nota de que tengo una copia menos de ese cromo
                this.cromosSinRepetidos.filter (e => e.cromo.id === elem.cromo.id)[0].rep--;
              }
            })
          }
        }, {
          text: 'NO',
          role: 'cancel',
          handler: () => {
            console.log('No regalo');
          }
        }
      ]
    }).then (res => res.present());


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

   DameLosCromosDelEquipo() {
    console.log ('voy a por los cromos del equipo');

    // primero me traigo el equipo del alumno que participa en el juego
    this.calculos.DameEquipoAlumnoEnJuegoDeColeccion (this.alumno.id, this.juegoseleccionado[0].id)
    .subscribe (equipo => {
                            this.equipo = equipo;
                            // Ahora traigo la inscripcion del equipo en el juego
                            this.dbService.DameInscripcionEquipoJuegoDeColeccion(this.juegoseleccionado[0].id, equipo.id)
                            .subscribe(inscripcionEquipo => {
                                                              // Y ahora me traigo los cromos del equipo
                                                               this.dbService.DameCromosEquipo(inscripcionEquipo[0].id)
                                                              .subscribe(CromosEquipo => {
                                                                                           console.log('aquí están los cromos: ',CromosEquipo);
                                                                                           this.cromosQueTengo = CromosEquipo;
                                                                                           this.cromosSinRepetidos = this.calculos.GeneraListaSinRepetidos(this.cromosQueTengo);
                                                                                           this.dbService.DameCromosColeccion(this.juegoseleccionado[0].coleccionId)
                                                                                           .subscribe(todosLosCromos => {
                                                                                                                          console.log('aqui estan todos los cromos',todosLosCromos);
                                                                                                                          console.log ('cromos que tengo',this.cromosQueTengo);
                                                                                                                          this.cromosQueNoTengo = this.calculos.DameCromosQueNoTengo(this.cromosQueTengo, todosLosCromos);
                                                                                                                          console.log ('cromos que NO tengo',this.cromosQueNoTengo);
                                                                                                                          this.PreparaImagenesCromosQueTengo();
                                                                                                                          this.PreparaImagenesCromosQueFaltan();
                                                                                                                          this.preparado = true;
                                                                                                                         });
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
  next() {
    this.slides.slideNext();
  }

  prev() {
    this.slides.slidePrev();
  }

}
