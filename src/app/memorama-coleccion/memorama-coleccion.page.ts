import { Component, OnInit,ViewChild } from '@angular/core';
import{DbServiceService} from 'src/app/db-service.service';
import { CalculosService } from '../Servicios/calculo.coleccion';
import * as URL from '../URLS/urls';
import { IonSlides } from '@ionic/angular';
import { NavController, IonContent, LoadingController, AlertController } from '@ionic/angular';
import { SesionService } from '../Servicios/sesion.service'; 
import { Router } from '@angular/router';
import { Console } from 'console';
import { coerceStringArray } from '@angular/cdk/coercion';
import { element } from 'protractor';

@Component({
  selector: 'app-memorama-coleccion',
  templateUrl: './memorama-coleccion.page.html',
  styleUrls: ['./memorama-coleccion.page.scss'],
})


export class MemoramaColeccionPage implements OnInit {

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
  text:string;

  familiaId:any;
  juegoDeMemoramaId:any;
  damecartasdelafamilia: any[]=[];
  damecartasdelafamilia2: any[]=[];
  cartasacertadas: any[]=[];
  
  carta1:any;
  posicioncarta1:number;
  carta2:any;
  posicioncarta2:number;

  Cartaspartedetras:any;






  async ionViewWillEnter()
  {
  
    this.juegoDeMemoramaId=localStorage.getItem("juegoDeMemoramaId");
    this.familiaId = localStorage.getItem("familiaId");

    console.log("juegoDeMemoramaId:", this.juegoDeMemoramaId,"familiaId:",this.familiaId);

    // this.damecartasdelafamilia = await this.dbService.Damecartasdelafamilia(this.familiaId).toPromise();

    // console.log("Estas son las cartas correspondientes a la familia:",this.damecartasdelafamilia);

    console.log("CAAAAAAAAAAAARTAAAAAAAAAAA1:",this.carta1);

    this.DameLasCartasDelAlumno();


    // window.addEventListener('load', function(){

    
    // const Carta =document.getElementById('CARTA');
    // Carta.onclick= function()
    //                         {
    //                           console.log("Hola");
    //                         }

    
    // });

    
    
    //   this.sliderConfig = {
        
    //     slidesPerView: 3,
    //     coverflowEffect: {
    //       rotate: 50,
    //       stretch: 0,
    //       depth: 0,
    //       modifier: 1,
    //       slideShadows: false, // LO PASO A FALSE XQ SINO SE ME QUEDA UNA SOMBRA FEA
    //     },
    //     on: {
    //       beforeInit() {
    //         const swiper = this;
      
    //         swiper.classNames.push(`${swiper.params.containerModifierClass}coverflow`);
    //         swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
      
    //         swiper.params.watchSlidesProgress = true;
    //         swiper.originalParams.watchSlidesProgress = true;
    //       },
    //       setTranslate() {
    //         const swiper = this;
    //         const {
    //           width: swiperWidth, height: swiperHeight, slides, $wrapperEl, slidesSizesGrid, $
    //         } = swiper;
    //         const params = swiper.params.coverflowEffect;
    //         const isHorizontal = swiper.isHorizontal();
    //         const transform$$1 = swiper.translate;
    //         const center = isHorizontal ? -transform$$1 + (swiperWidth / 2) : -transform$$1 + (swiperHeight / 2);
    //         const rotate = isHorizontal ? params.rotate : -params.rotate;
    //         const translate = params.depth;
    //         // Each slide offset from center
    //         for (let i = 0, length = slides.length; i < length; i += 1) {
    //           const $slideEl = slides.eq(i);
    //           const slideSize = slidesSizesGrid[i];
    //           const slideOffset = $slideEl[0].swiperSlideOffset;
    //           const offsetMultiplier = ((center - slideOffset - (slideSize / 2)) / slideSize) * params.modifier;
      
    //            let rotateY = isHorizontal ? rotate * offsetMultiplier : 0;
    //           let rotateX = isHorizontal ? 0 : rotate * offsetMultiplier;
    //           // var rotateZ = 0
    //           let translateZ = -translate * Math.abs(offsetMultiplier);
      
    //            let translateY = isHorizontal ? 0 : params.stretch * (offsetMultiplier);
    //           let translateX = isHorizontal ? params.stretch * (offsetMultiplier) : 0;
      
    //            // Fix for ultra small values
    //           if (Math.abs(translateX) < 0.001) translateX = 0;
    //           if (Math.abs(translateY) < 0.001) translateY = 0;
    //           if (Math.abs(translateZ) < 0.001) translateZ = 0;
    //           if (Math.abs(rotateY) < 0.001) rotateY = 0;
    //           if (Math.abs(rotateX) < 0.001) rotateX = 0;
      
    //            const slideTransform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)  rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      
    //            $slideEl.transform(slideTransform);
    //           $slideEl[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;
    //           if (params.slideShadows) {
    //             // Set shadows
    //             let $shadowBeforeEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
    //             let $shadowAfterEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');
    //             if ($shadowBeforeEl.length === 0) {
    //               $shadowBeforeEl = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'left' : 'top'}"></div>`);
    //               $slideEl.append($shadowBeforeEl);
    //             }
    //             if ($shadowAfterEl.length === 0) {
    //               $shadowAfterEl = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'right' : 'bottom'}"></div>`);
    //               $slideEl.append($shadowAfterEl);
    //             }
    //             if ($shadowBeforeEl.length) $shadowBeforeEl[0].style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
    //             if ($shadowAfterEl.length) $shadowAfterEl[0].style.opacity = (-offsetMultiplier) > 0 ? -offsetMultiplier : 0;
    //           }
    //         }
      
    //          // Set correct perspective for IE10
    //         if (swiper.support.pointerEvents || swiper.support.prefixedPointerEvents) {
    //           const ws = $wrapperEl[0].style;
    //           ws.perspectiveOrigin = `${center}px 50%`;
    //         }
    //       },
    //       setTransition(duration) {
    //         const swiper = this;
    //         swiper.slides
    //           .transition(duration)
    //           .find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left')
    //           .transition(duration);
    //       }
    //     }
    //   };
                           

    //   this.alumnoID = localStorage.getItem("alumnoID"); // 136
    //   console.log("alumnoID:",this.alumnoID); 
    //   this.alumno= await this.dbService.dameAlumnoporidalumno(this.alumnoID).toPromise();
    //   console.log("Datos alumno:",this.alumno);

    //   this.id = localStorage.getItem("idjuegodecoleccion");
    //   console.log(this.id);
    //   this.juegoseleccionado = await this.dbService.dameJuegoporidjuego(this.id).toPromise();
    //   console.log("Datos juego:",this.juegoseleccionado);

    //   //ColeccionID
    //   console.log("ColeccionId",this.juegoseleccionado[0].coleccionId);

    //   this.dbService.DameColeccionPromise(this.juegoseleccionado[0].coleccionId)
    //   .then(coleccion => this.coleccion=coleccion);
    //   //this.equipo=this.sesion.DameEquipo();

    //   if(this.juegoseleccionado[0].Modo === 'Individual' )
    //   {
    //      this.DameLosCromosDelAlumno();
    //   }
      
    //   else {
    //     this.DameLosCromosDelEquipo ();
  
    //   }

    //   if (this.juegoseleccionado[0].Modo === 'Individual') {
    //     console.log("<----------Hola Individual---------->");
    //     console.log("Juego Seleccionado ID: ",this.juegoseleccionado[0].id);

    //     this.dbService.DameAlumnosJuegoDeColeccion(this.juegoseleccionado[0].id)
    //     .subscribe (alumnos => {
    //                             this.alumnosJuegoDeColeccion = alumnos;
    //                             // quito de la lista al alumno que hace el regalo
    //                             this.alumnosJuegoDeColeccion = this.alumnosJuegoDeColeccion.filter (alumno => alumno.id !== this.alumno.id);
    //                            });
    //   }

    //   else if ((this.juegoseleccionado[0].Modo === 'Equipos') && (this.juegoseleccionado[0].Asignacion === 'Equipo')) {
    //     console.log("<----------Hola Equipos asignacion Equipo---------->");
    //     console.log("Juego Seleccionado ID: ",this.juegoseleccionado[0].id);
        
    //     this.dbService.DameEquiposJuegoDeColeccion(this.juegoseleccionado[0].id)
    //     .subscribe (equipos => {
    //                             this.equiposJuegoDeColeccion = equipos;
    //                             // quito de la lista al equipo que hace el regalo
    //                             this.equiposJuegoDeColeccion = this.equiposJuegoDeColeccion.filter (equipo => equipo.id !== this.equipo.id);
    //                           });
    //   }

    //   else {
    //     // se trata de un juego de equipo pero con asignación individual
    //     // recuperamos los alumnos del grupo
    //     console.log("<----------Hola Equipos asignacion Individual---------->");
    //     console.log("Juego Seleccionado ID: ",this.juegoseleccionado[0].id);
        
    //     this.dbService.DameAlumnosGrupo(this.juegoseleccionado[0].grupoId)
    //     .subscribe (alumnos => {
    //           this.alumnosJuegoDeColeccion = alumnos;
    //           // quito de la lista al alumno que hace el regalo
    //           this.alumnosJuegoDeColeccion = this.alumnosJuegoDeColeccion.filter (alumno => alumno.id !== this.alumno.id);
    //     });
    //   }

    //   //////Bien Corregio
    //   this.ElegirYRegalarCromo = (cromo: any) => {
    //     return new Promise<boolean>((resolve, reject) => {
    //       const misInputs: any [] = [];
  
    //       if (this.juegoseleccionado[0].Modo === 'Individual') {

    //         console.log("Modo Juego seleccionado:",this.juegoseleccionado[0].Modo);
    //         // preparo las opciones para el radio selector
    //         this.alumnosJuegoDeColeccion.forEach (alumno => {
    //           const input = {
    //             type: 'radio',
    //             label: alumno.Nombre + ' ' + alumno.PrimerApellido + ' ' + alumno.SegundoApellido,
    //             value: alumno.id,
    //             checked: false
    //           };
    //           misInputs.push (input);
    //           console.log("Mis inputs:",misInputs);
    //         });
    //         misInputs[0].checked = true; // la primera opción está marcada por defecto
    //         this.alertCtrl.create({
    //           cssClass: 'my-custom-class',
    //           header: 'Elige a quién quieres regalar el cromo',
    //           inputs : misInputs,
    //           buttons: [
    //             {
    //               text: 'Cancelar',
    //               role: 'cancel',
    //               cssClass: 'secondary',
    //               handler: () => {
    //                 console.log('Me arrepiento');
    //                 // El alumno se ha arrepentido. Resuelvo la promise retornando falso
    //                 resolve (false);
    //               }
    //             }, {
    //               text: 'Ok',
    //               handler: async (destinatarioId) => {
    //                 console.log("DestinatarioId:",destinatarioId);
    //                 // recibo el id del alumno destinatorio del cromo
    //                 console.log("Datos RegalaCromoAlumnos","Cromo:",cromo,"Id Destino:", destinatarioId,"Alumno ID:", this.alumnoID,"Juego seleccionado:" ,this.juegoseleccionado[0]);
                    
    //                 this.calculos.RegalaCromoAlumnos(cromo, destinatarioId, this.alumnoID, this.juegoseleccionado[0]);
    //                 const alert2 = await this.alertCtrl.create({
    //                     cssClass: 'my-custom-class',
    //                     header: 'Cromo regalado con éxito',
    //                     buttons: ['OK']
    //                 }).then (res => res.present());
    //                 // resuelvo indicando que si se ha hecho el regalo
    //                 resolve (true);
    //               }
    //             }
    //           ]
    //         }).then (res => res.present());
  
    //       } 
          
    //       ///////////////////////////////MODO EQUIPOS

    //       else if ((this.juegoseleccionado[0].Modo === 'Equipos') && (this.juegoseleccionado[0].Asignacion === 'Equipo')) {
    //         // preparo las opciones para el radio selector
    //         this.equiposJuegoDeColeccion.forEach (equipo => {
    //           const input = {
    //             type: 'radio',
    //             label: equipo.Nombre,
    //             value: equipo.id,
    //             checked: false
    //           };
    //           misInputs.push (input);
    //         });
    //         misInputs[0].checked = true; // la primera opción está marcada por defecto
    //         this.alertCtrl.create({
    //           cssClass: 'my-custom-class',
    //           header: 'Elige a qué equipo quieres regalar el cromo',
    //           inputs : misInputs,
    //           buttons: [
    //             {
    //               text: 'Cancelar',
    //               role: 'cancel',
    //               cssClass: 'secondary',
    //               handler: () => {
    //                 console.log('Me arrepiento');
    //                 resolve (false);
  
    //               }
    //             }, {
    //               text: 'Ok',
    //               handler: async (destinatarioId) => {
    //                 // recibo el id del alumno destinatorio del cromo
    //                 this.calculos.RegalaCromoEquipos(cromo, destinatarioId, this.equipo.id, this.juegoseleccionado[0]);
    //                 this.alertCtrl.create({
    //                     cssClass: 'my-custom-class',
    //                     header: 'Cromo regalado con éxito',
    //                     buttons: ['OK']
    //                 }).then (res => res.present());
    //                 resolve (true);
    //               }
    //             }
    //           ]
    //         }).then (res => res.present());
  
  
  
    //       } 
          
    //       else {
    //         // Juego en equipo pero con asignación individual
    //         // preparo las opciones para el radio selector
    //         this.alumnosJuegoDeColeccion.forEach (alumno => {
    //           const input = {
    //             type: 'radio',
    //             label: alumno.Nombre + ' ' + alumno.PrimerApellido + ' ' + alumno.SegundoApellido,
    //             value: alumno.id,
    //             checked: false
    //           };
    //           misInputs.push (input);
    //         });
    //         misInputs[0].checked = true; // la primera opción está marcada por defecto
    //         this.alertCtrl.create({
    //           cssClass: 'my-custom-class',
    //           header: 'Elige a quién quieres regalar el cromo',
    //           inputs : misInputs,
    //           buttons: [
    //                     {
    //                       text: 'Cancelar',
    //                       role: 'cancel',
    //                       cssClass: 'secondary',
    //                       handler: () => {
    //                         console.log('Me arrepiento');
    //                         resolve (false);
    //                       }
    //                     }, {
    //                       text: 'Ok',
    //                       handler: async (destinatarioId) => {
    //                         // recibo el id del alumno destinatorio del cromo
    //                         this.calculos.RegalaCromoAlumnoEquipo(cromo, destinatarioId, this.alumno.id, this.juegoseleccionado[0]);
    //                         this.alertCtrl.create({
    //                             cssClass: 'my-custom-class',
    //                             header: 'Cromo regalado con éxito',
    //                             buttons: ['OK']
    //                         }).then (res => res.present());
    //                         resolve (true);
    //                       }
    //                     }
    //                   ]
    //         }).then (res => res.present());
    //       }
  
    //     });
    //   };

    // ///////////////////////////////MODO EQUIPOS

}

click(e){

  console.log("Posicion:",e);

  if(this.carta1 === undefined)
  {
     this.carta1=this.damecartasdelafamilia2[e];
     this.posicioncarta1=e;
      console.log("Carta1:",this.carta1,"Posiccion:",this.posicioncarta1);
  }

  else if(this.carta2 === undefined)
  {
     this.carta2=this.damecartasdelafamilia2[e];
     this.posicioncarta2=e;
      console.log("Carta2:",this.carta2,"Posicion:",this.posicioncarta2);
  }

  else{
    console.log("Ya tenemos las dos cartas guardaas");
  }

  console.log("Carta 1:",this.carta1);
  console.log("Carta2 :",this.carta2);

  if(this.carta1 != undefined && this.carta2 !=undefined ){
          console.log("Vamos al lío");
       
            if (this.carta1.id === this.carta2.id){
            console.log("Punto");
          
            this.cartasacertadas.push(this.carta1.id);
            
            //LIMPIAMOS
            this.carta1=undefined;
            this.carta2=undefined;
            console.log(this.carta1,this.carta2);
            this.damecartasdelafamilia[this.posicioncarta1]= this.Cartaspartedetras;
            this.damecartasdelafamilia[this.posicioncarta2]= this.Cartaspartedetras;



                    }
          else{
            
            console.log("Has fallado");
            
            //LIMPIAMOS
            this.carta1=undefined;
            this.carta2=undefined;
            console.log(this.carta1,this.carta2);
          }

  }

}


DameLasCartasDelAlumno() {

  this.dbService.Damecartasdelafamilia(this.familiaId)
  .subscribe(Cartas =>{
                      for(let i=0;Cartas.length>i;i++)
                      {
                        this.damecartasdelafamilia.push(Cartas[i]);
                        this.damecartasdelafamilia.push(Cartas[i]);



                      }

                      // this.damecartasdelafamilia2=this.damecartasdelafamilia;
                      
                       console.log("damecartasdelafamilia",this.damecartasdelafamilia);
                        this.MezclarArray();
                        this.PreparaImagenesCartasQueTengo();
                        this.preparado = true;


                       
  })

}

MezclarArray(){

  this.damecartasdelafamilia.sort(function(){return Math.random()-0.5});


}

PreparaImagenesCartasQueTengo() {

  for (let i = 0; i < this.damecartasdelafamilia.length; i++) {
    
    const elem = this.damecartasdelafamilia[i];
    
    this.damecartasdelafamilia2.push(elem);

    this.damecartasdelafamilia[i] = URL.ImagenesCartas + elem.imagenDelante;
    console.log("cartasQueTengoImagenDelante[i]:",this.damecartasdelafamilia[i]);
    console.log("damecartasdelafamilia2",this.damecartasdelafamilia2);

    this.Cartaspartedetras=URL.ImagenesCartasdetras + elem.imagenDetras;
    // this.cromosQueTengoImagenDetras[i] = URL.ImagenesCromo + elem.cromo.ImagenDetras;
    
  }
  
}



   DameLosCromosDelEquipo() {
    console.log ('voy a por los cromos del equipo');

    // primero me traigo el equipo del alumno que participa en el juego
    console.log(this.alumno.id)
    this.calculos.DameEquipoAlumnoEnJuegoDeColeccion (this.alumnoID, this.juegoseleccionado[0].id)
    .subscribe (equipo => {
                            console.log("Hola");
                            this.equipo = equipo;
                            console.log("Identidad Equipo",equipo.id);
                            // Ahora traigo la inscripcion del equipo en el juego
                            this.dbService.DameInscripcionEquipoJuegoDeColeccion(this.juegoseleccionado[0].id, equipo.id)
                            .subscribe(inscripcionEquipo => {
                                                               console.log("error");
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
                                                                                                                          // this.PreparaImagenesCromosQueFaltan();
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

      console.log("cromosQueTengoImagenDelante[i]:",this.cromosQueTengoImagenDelante[i]);

      if (this.coleccion.DosCaras) {
        this.cromosQueTengoImagenDetras[i] = URL.ImagenesCromo + elem.cromo.ImagenDetras;
      }
    }
  }
  

}

