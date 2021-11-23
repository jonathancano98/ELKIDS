import { Component, OnInit,ViewChild,AfterViewChecked,AfterContentChecked,ViewChildren,QueryList,ElementRef, AfterViewInit, AfterContentInit,Renderer2 } from '@angular/core';
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
import { AnyRecordWithTtl } from 'dns';

@Component({
  selector: 'app-memorama-coleccion',
  templateUrl: './memorama-coleccion.page.html',
  styleUrls: ['./memorama-coleccion.page.scss'],
  template:'<div #level></div>'
})


export class MemoramaColeccionPage implements OnInit,AfterContentChecked,AfterViewChecked,AfterViewInit,AfterContentInit{

  constructor(private dbService:DbServiceService,
              private calculos: CalculosService,
              private alertCtrl: AlertController,
              private sesion: SesionService,
              private navCtrl: NavController,
              private router: Router,
              private renderer:Renderer2
             ) { }



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

  Cartaspartedetras: any[]=[];
  cartasafter:any;
  posicion:any;
  divs: any[]=[];
  Objeto:any;

 ////////////////////////VARIABLES

 ////////////////////////////////////////////////////////////////////VIEWCHILD
 @ViewChild(IonSlides, { static: false }) slides: IonSlides;
 @ViewChild('content', { static: false }) content: IonContent;
 @ViewChild('level', {static: false}) levels: ElementRef;
 ////////////////////////////////////////////////////////////////////VIEWCHILD

 addMyClass(){
 }



 ngOnInit() {


 }

  ngAfterViewInit(){

  //   this.cartasafter = document.querySelectorAll('.grid-item');
  //   console.log("GRID-ITEM:",this.cartasafter);

  //   console.log("OBJETO",this.Objeto);
     
  //   let hasflippedcard=false;
  //   let firstcard,secondcard;
  //   let posicion1,posicion2;

  //   posicion1=this.posicioncarta1;
  //   posicion2=this.posicioncarta2;

  //   console.log(this.posicion);

 

  // this.cartasafter.forEach(cartita =>  cartita.addEventListener('click', 
  
  // function(){
    
    
  //  cartita.classList.toggle('flip');  // EL TOGGLE lo que hace es modificar la clase al nombre que le pases
 


  //  if(!hasflippedcard){
  //    hasflippedcard=true;
  //    firstcard=this;
  //    console.log("FIRST CARD",firstcard,"posicion1",posicion1);
  //  }
  //  else{
  //    hasflippedcard=false;
  //    secondcard=this;
  //    console.log("SECOND CARD",secondcard,"posicion2",posicion2);
  //  }


  //  console.log("FIRSTCARD:",firstcard,"SECONDCARD:",secondcard)

  //  if (firstcard!= undefined){
  //    console.log("HOLAx1")
  //       if(secondcard != undefined){
          
  //         console.log("HOLAx2");
  //         if(firstcard == secondcard){
  //           console.log("SIIII");
  //           firstcard=undefined;
  //           secondcard=undefined;

  //         }

  //         else{
  //           console.log("NOOO");
  //           setTimeout(() =>{
  //           firstcard.classList.remove('flip');
  //           secondcard.classList.remove('flip');
  //               },1500);
  //           firstcard=undefined;
  //           secondcard=undefined;
  //         }
  //       }
  // }

  
  //   }));



  

 }

 async ionViewWillEnter()
  {

    console.log("ionViewWillEnter");


    // RECOJO LAS VARIABLES juegoDeMemoramaId y la familiaId
    this.juegoDeMemoramaId=localStorage.getItem("juegoDeMemoramaId");
    this.familiaId = localStorage.getItem("familiaId");

    console.log("juegoDeMemoramaId:", this.juegoDeMemoramaId,"familiaId:",this.familiaId);

 
    // Pido las cartas del Alumno
    this.DameLasCartasDelAlumno();



}
ngAfterViewChecked(){}

ngAfterContentChecked(){}

ngAfterContentInit(){
  
  // this.levels.toArray();

  // console.log("OBJETO",this.Objeto);


  // this.levels.changes.subscribe(() =>{ 

  //   console.log(this.levels.toArray());
  //   this.divs= this.levels.toArray();

  //   for(let i=0;this.divs.length>i;i++){
  //   console.log(this.divs[i].nativeElement);
  //   }



  //   this.cartasafter = document.querySelectorAll('.grid-item');
  //   console.log("GRID-ITEM:",this.cartasafter);

  //   console.log("OBJETO",this.Objeto);
     
  //   let hasflippedcard=false;
  //   let firstcard,secondcard;
  //   let posicion1,posicion2;

  //   posicion1=this.posicioncarta1;
  //   posicion2=this.posicioncarta2;

  //   console.log(this.posicion);

 

  // this.cartasafter.forEach(cartita => cartita.addEventListener('click',function(){
    

  //  cartita.classList.toggle('flip');  // EL TOGGLE lo que hace es modificar la clase al nombre que le pases

  //  if(!hasflippedcard){
  //    hasflippedcard=true;
  //    firstcard=this;
  //    console.log("FIRST CARD",firstcard,"posicion1",posicion1);
  //  }
  //  else{
  //    hasflippedcard=false;
  //    secondcard=this;
  //    console.log("SECOND CARD",secondcard,"posicion2",posicion2);
  //  }


  //  if(firstcard === secondcard){
  //    console.log("IGUALES");
  //  }
      

  
  //   }));

  // });




  // console.log("OBJETO",this.Objeto);
  // console.log("ngAfterContentChecked()");
  // this.cartasafter = document.querySelectorAll('.grid-item');
  // console.log("GRID-ITEM:",this.cartasafter);
 
  // console.log("LA POSICION ES:",this.posicion);
  // let hasflippedcard=false;
  // let firstcard,secondcard;

 

  // this.cartasafter.forEach(cartita => cartita.addEventListener('click',function(){
    
  //  cartita.classList.toggle('flip');  // EL TOGGLE lo que hace es modificar la clase al nombre que le pases

  //  if(!hasflippedcard){
  //    hasflippedcard=true;
  //    firstcard=this;
  //    console.log("FIRST CARD",firstcard);
  //  }
  //  else{
  //    hasflippedcard=false;
  //    secondcard=this;
  //    console.log("SECOND CARD",secondcard);
  //  }

      

  
  //   }));


    
 

}





 click(e:any){

  this.posicion= e;
  this.Objeto= this.damecartasdelafamilia2[e].Nombre;

   console.log("Posicion:",e,"Animal:",this.Objeto);
   console.log(this.damecartasdelafamilia2[e].Nombre);
  
 
  // this.posicion=e;

  // if(this.carta1 === undefined)
  // {
  //    this.carta1=this.damecartasdelafamilia2[e];
  //    this.posicioncarta1=e;
  //     console.log("Carta1:",this.carta1,"Posicion:",this.posicioncarta1);
  // }

  // else if(this.carta2 === undefined)
  // {
  //    this.carta2=this.damecartasdelafamilia2[e];
  //    this.posicioncarta2=e;
  //     console.log("Carta2:",this.carta2,"Posicion:",this.posicioncarta2);
  // }

  // else{
  //   console.log("Ya tenemos las dos cartas guardaas");
  // }

  // // console.log("Carta 1:",this.carta1);
  // // console.log("Carta2 :",this.carta2);

  // if(this.carta1 != undefined && this.carta2 !=undefined ){
  //         console.log("Vamos al lío");
       
  //           if (this.carta1.id === this.carta2.id){
  //           console.log("Punto");
          
  //           this.cartasacertadas.push(this.carta1.id);
            
  //           //LIMPIAMOS
  //           this.carta1=undefined;
  //           this.carta2=undefined;
  //           console.log(this.carta1,this.carta2);
  //           this.Cartaspartedetras[this.posicioncarta1]=this.damecartasdelafamilia[this.posicioncarta1];
  //           this.Cartaspartedetras[this.posicioncarta2]=this.damecartasdelafamilia[this.posicioncarta2];



  //                   }
  //         else{
            
  //           console.log("Has fallado");
            
  //           //LIMPIAMOS
  //           this.carta1=undefined;
  //           this.carta2=undefined;
  //           console.log(this.carta1,this.carta2);
  //         }

  // }

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
    
    //LOS METO EN ESTE ARRAY PORQUE EN ELEM ESTA LA INFO DE CADA CARTA
    this.damecartasdelafamilia2.push(elem);

    //PARTE DE ADELANTE
    this.damecartasdelafamilia[i] = URL.ImagenesCartas + elem.imagenDelante;
    //console.log("cartasQueTengoImagenDelante[i]:",this.damecartasdelafamilia[i]);
    // console.log("damecartasdelafamilia2",this.damecartasdelafamilia2);

    //PARTE DE ATRAS
    this.Cartaspartedetras[i]=URL.ImagenesCartasdetras + elem.imagenDetras;
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

