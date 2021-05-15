import { hostViewClassName, R3TargetBinder } from '@angular/compiler';
import { Component } from '@angular/core';
import { ValueAccessor } from '@ionic/angular/directives/control-value-accessors/value-accessor';
import interact from 'interactjs';
import { element } from 'protractor';
import{DbServiceService} from 'src/app/db-service.service'
import { ImagenToBackend } from '../home/clases/imagenGuardada';
import{ImagenToBackendEdu} from '../home/clases/imagenGuardadaEdu';
import{PersonajesPagina} from '../home/clases/PersonajesPagina'
import{TextoCuento} from '../home/clases/TextoCuento'
import{Imagen}from'../home/clases/imagen';


import { ViewChild,ElementRef } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage {

  constructor(private dBservice: DbServiceService) {}


  @ViewChild('canvas', { static: true }) 
  canvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;
  clase="";
  girarImagen=0;
  //value = 'https://cdn1.iconfinder.com/data/icons/hawcons/32/699470-icon-4-thumb-up-256.png';
  value='';

  fondoPrimero = 'https://www.bbva.com/wp-content/uploads/2017/11/iceberg-recurso-fondo-de-comercio-bbva-1024x416.jpg';

  listaFotosPersonajes: any[] = [];
  listaFotosFondos: any[] = [];
  listaFotosObjetos: any[] = [];
  listaFotosDeEscena: any[] = [];

  listaTexto: TextoCuento[]=[];

  listaPersonajesPagina: PersonajesPagina[] = []
  listaReordenarCanvas: PersonajesPagina[]=[]


  listaRecursos: any[] = [];
  recursoId: Number;
  recursoCargadoPregunta: any = false;
  recursoCargado: any;
  personajePagina: PersonajesPagina;


  mark: string;
  prueba34=-1;


  async ngOnInit() {

    this.recuperarListaRecursos();
    console.log('HOLA');
    console.log(this.listaRecursos);
    this.obtengoNumeroEscenas()

    var bocadilloImagen = new Image;
    bocadilloImagen.src='../../assets/icon/bocadillo.png'
    this.value=bocadilloImagen.src

  }
  signalSelected (markVal: string){
    
    markVal = this.mark
    console.log("FUNCION SIGNAL: "+markVal)
     return markVal;
}


elementoGirar = '';

zIndexImagenes=0;
testeo2(objeto:any,event,objeto2){

document.getElementById(objeto).classList.add('positionAbsolute')
//document.getElementById(objeto).style.position="absolute"
this.zIndexImagenes=this.zIndexImagenes+1;
document.getElementById(objeto).style.zIndex=""+this.zIndexImagenes+""

//document.getElementById(objeto).classList.remove('zindex')
//document.getElementById(objeto).classList.add('zindex1')
  this.listaFotosDeEscena.forEach(obj=>{
    if(obj.nombre==objeto){
      var imagen=document.getElementById(obj.nombre) as HTMLCanvasElement
      this.elementoGirar=obj.nombre;
      //this.scaleXGirar=obj.invertir;
    console.log(imagen.getBoundingClientRect().x)
    }
    else{
      //document.getElementById(obj.nombre).classList.remove('zindex1')
      //document.getElementById(objeto).classList.add('zindex')
      document.getElementById(obj.nombre).classList.add('positionAbsolute')
     // document.getElementById(obj.nombre).style.position="absolute"
     // document.getElementById(obj.nombre).style.zIndex="0"
    }
  })

console.log("objeto2: "+objeto2)
console.log(event.target)
if(event.target==document.getElementById(objeto2))
{
  console.log("PROBANDO: "+event.target)
}


if(this.resizeAngle==true)
{

     var target = event.target
    target.setAttribute('data-angle',0)
    var scaleX=target.dataset.scaleX;
    var x = target.dataset.x;
    var y = target.dataset.y;
    this.listaFotosDeEscena.forEach(elemento=>{

      if(elemento.nombre==objeto)
      {
        scaleX=elemento.invertir;
      }

    })
    console.log("scaleX: "+scaleX+" x: "+x+"y: "+y);
    target.style.transform =
      'translate(' + x + 'px,' + y + 'px) scaleX('+scaleX+')';

}

}

scaleXGirar= 1;

testeo(objeto:any,event)
{
  console.log("Has clickado a un personaje");

  this.listaFotosDeEscena.forEach(obj=>{
    
    this.scaleXGirar=obj.invertir;
    var imagenObjeto= document.getElementById(objeto)

    var target = event.target
    var rotation = (parseFloat(target.getAttribute('data-angle')) || 0)


    if(obj.nombre==objeto){
      document.getElementById(obj.nombre).classList.remove('cajita');
    }


    if(obj.nombre==objeto && obj.invertir==1)
    {
        obj.invertir=-1;
       

      var x = imagenObjeto.dataset.x;
      var y = imagenObjeto.dataset.y;
    
    
    
      if (typeof x != 'undefined' && typeof y != 'undefined') {
        imagenObjeto.style.transform = 'translate(' + x + 'px, ' + y + 'px) scaleX(-1)';
      } else {
        imagenObjeto.style.transform = 'scaleX(-1)';
      }

    }
    
    else if(obj.nombre==objeto && obj.invertir==-1)
    {
      var x = imagenObjeto.dataset.x;
      var y = imagenObjeto.dataset.y;
    
    
    
      if (typeof x != 'undefined' && typeof y != 'undefined') {
        imagenObjeto.style.transform = 'translate(' + x + 'px, ' + y + 'px) scaleX(1)';
      } else {
        imagenObjeto.style.transform = 'scaleX(1)';
      }
    
      obj.invertir=1;
    }

  })



}

contadorIDPersonajes=0;
numeroPaginas;

crearPagina(){


this.listaFotosDeEscena.forEach(obj=>{
 

  var imagendeEscena= new PersonajesPagina;
  imagendeEscena.personajeID=this.contadorIDPersonajes;
  this.contadorIDPersonajes=this.contadorIDPersonajes+1;
  imagendeEscena.nombre=obj.nombre;

  var imagenObjeto = document.getElementById(obj.nombre) as HTMLImageElement & HTMLCanvasElement

  imagendeEscena.imagenWidth=imagenObjeto.width;
  imagendeEscena.imagenHeight=imagenObjeto.height;
  imagendeEscena.invertir=obj.invertir;
  imagendeEscena.rotate=(parseFloat(imagenObjeto.getAttribute('data-angle')) || 0);
  imagendeEscena.zindex=imagenObjeto.style.zIndex.valueOf();

  console.log("NUEVA observacion "+imagendeEscena.zindex);

  imagendeEscena.canvasX=imagenObjeto.getBoundingClientRect().left;
  imagendeEscena.canvasY=imagenObjeto.getBoundingClientRect().top;

  imagendeEscena.fondoUrl=this.fondoElegido;

  console.log("OBERSVO MUCHO: "+imagenObjeto.getAttribute('data-x'))

  imagendeEscena.imagenDataX =parseFloat(imagenObjeto.getAttribute('data-x'));
  imagendeEscena.imagenDataY = parseFloat(imagenObjeto.getAttribute('data-y'));
  imagendeEscena.especial=obj.especial;
  imagendeEscena.id=obj.id;
  imagendeEscena.tipo=obj.tipo;
  imagendeEscena.url=obj.url;
  imagendeEscena.positionlista=obj.positionlista;

  imagendeEscena.translate=imagenObjeto.getAttribute('style');

  this.listaPersonajesPagina.push(imagendeEscena);

})



this.listaFotosDeEscena=[];


this.drawCanvas();




this.pruebaCanvasUrl();

this.ctx.clearRect(0, 0, 1000, 500);




}

dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
     bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while (n--) {
     u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}


obtengoNumeroEscenas()
{

  this.dBservice.obtenerImagenesEscena(localStorage.getItem("contenedor"))
  .subscribe((res) => {
  
    this.numeroPaginas = res.length;
    console.log(this.numeroPaginas);
  
  
  })


}



//guarda el url


async pruebaCanvasUrl(){


  


  const formData: FormData = new FormData();
  var micanvas = document.getElementById("canvas") as HTMLCanvasElement;
  var dataURL = micanvas.toDataURL();
  var file = this.dataURLtoFile(dataURL,this.numeroPaginas + '.png')
  this.numeroPaginas++;

  formData.append('fotoFrame', file);

  await this.postFotoFrame(formData);


 
}

async postFotoFrame(formData: FormData) {

  var contenedor = localStorage.getItem("contenedor");

  this.dBservice.postImage(contenedor, formData)
     .subscribe((res) => {
       console.log("ok")


     }
        , (err) => {
           console.log("error al subir la imagem");
           console.log('Error : ' + err);
        });
}



pruebatranslate(){
 
  document.getElementById("prueba").classList.add('zindex')
  this.listaPersonajesPagina.forEach(obj=>{

    console.log("ZETAS: "+obj.zindex+" Nombre: "+obj.nombre)


  })
  
}


drawCanvas(){

  //Primero dibujamos el fondo
  this.seleccionarfondo(this.fondoElegido);

  this.listaTexto.forEach(texto=>{

    var Texto = new Image;

    Texto.src=this.value;

    this.ctx.drawImage(Texto,texto.imagenX,texto.imagenY,texto.imagenWidth,texto.imagenHeight);

    this.ctx.fillText(texto.textoString,texto.textoX,texto.textoY);


  })

  for(var i=0;i<this.listaPersonajesPagina.length;i++){

    for(var j=0;j<this.listaPersonajesPagina.length;j++){
console.log("PRRRROBAMOSSSS O.O "+this.listaPersonajesPagina[i].rotate)
  if(this.listaPersonajesPagina[i].zindex>=this.listaPersonajesPagina[j].zindex && this.listaPersonajesPagina[i].pintado==false){


    var imagendeEscena= new PersonajesPagina;

    imagendeEscena.url = this.listaPersonajesPagina[i].url;
    imagendeEscena.nombre = this.listaPersonajesPagina[i].nombre;
    imagendeEscena.tipo = this.listaPersonajesPagina[i].tipo;
    imagendeEscena.especial = this.listaPersonajesPagina[i].especial;
    imagendeEscena.imagenDataX=this.listaPersonajesPagina[i].imagenDataX;
    imagendeEscena.imagenDataY=this.listaPersonajesPagina[i].imagenDataY;
    imagendeEscena.translate=this.listaPersonajesPagina[i].translate;

    imagendeEscena.imagenWidth=this.listaPersonajesPagina[i].imagenWidth;
    imagendeEscena.imagenHeight=this.listaPersonajesPagina[i].imagenHeight;
    imagendeEscena.invertir=this.listaPersonajesPagina[i].invertir;

    imagendeEscena.canvasX=this.listaPersonajesPagina[i].canvasX;
    imagendeEscena.canvasY=this.listaPersonajesPagina[i].canvasY;

    imagendeEscena.rotate=this.listaPersonajesPagina[i].rotate;
    imagendeEscena.zindex=this.listaPersonajesPagina[i].zindex;


    this.listaPersonajesPagina[i].pintado=true;
    this.listaReordenarCanvas.push(imagendeEscena)

  }

    }

  }
  
  
  var Imagen = new Image;
  var angle=0;
this.listaReordenarCanvas.forEach(objeto=>{

 angle=objeto.rotate*(180/Math.PI);
  Imagen.src=objeto.url;
  this.ctx = this.canvas.nativeElement.getContext('2d');
console.log("ANG: "+angle);



  if(objeto.invertir==-1 && objeto.rotate==0)
  {
    this.ctx.save();
    this.ctx.translate(objeto.canvasX+objeto.imagenWidth/2,0);
  //this.ctx.rotate(objeto.rotate)
  this.ctx.scale(-1,1)
 
  this.ctx.drawImage(Imagen,-objeto.imagenWidth/2+20,objeto.canvasY-18,objeto.imagenWidth,objeto.imagenHeight)
 this.ctx.restore();

  }else if(objeto.invertir==1 && objeto.rotate==0)
  {
    this.ctx.save();
  

    this.ctx.drawImage(Imagen,objeto.canvasX-20,objeto.canvasY-18,objeto.imagenWidth,objeto.imagenHeight)

    

    this.ctx.restore();
  }else if(objeto.invertir==1 && objeto.rotate!=0){

    this.ctx.save();

    
    this.ctx.translate(objeto.canvasX+objeto.imagenWidth/2+18,objeto.canvasY+objeto.imagenHeight/2+18);
    this.ctx.rotate(objeto.rotate)
    this.ctx.translate(-objeto.imagenWidth/2,-objeto.imagenHeight/2);
    this.ctx.drawImage(Imagen,0,0,objeto.imagenWidth,objeto.imagenHeight)
    

    this.ctx.restore();

  }else if(objeto.invertir==-1 && objeto.rotate!=0){

    this.ctx.save();

    
    this.ctx.translate(objeto.canvasX+objeto.imagenWidth/2+18,objeto.canvasY+objeto.imagenHeight/2+18);
    this.ctx.rotate(objeto.rotate)
    this.ctx.translate(-objeto.imagenWidth/2,-objeto.imagenHeight/2);
    this.ctx.drawImage(Imagen,0,0,objeto.imagenWidth,objeto.imagenHeight)
    

    this.ctx.restore();
 
  

    this.ctx.restore();

  }
  
})

this.listaReordenarCanvas=[];

}

async recuperarPagina(){

  var fondoSeleccionado=''

this.listaPersonajesPagina.forEach(objeto=>{

var imagenRecuperada = new ImagenToBackend

imagenRecuperada.url = objeto.url;
imagenRecuperada.nombre = objeto.nombre;
imagenRecuperada.tipo = objeto.tipo;
imagenRecuperada.especial = objeto.especial;
imagenRecuperada.imagenDataX=objeto.imagenDataX;
imagenRecuperada.imagenDataY=objeto.imagenDataY;
imagenRecuperada.translate=objeto.translate;

imagenRecuperada.imagenWidth=objeto.imagenWidth;
imagenRecuperada.imagenHeight=objeto.imagenHeight;
imagenRecuperada.invertir=objeto.invertir;

imagenRecuperada.canvasX=objeto.canvasX;
imagenRecuperada.canvasY=objeto.canvasY;

imagenRecuperada.rotate=objeto.rotate;
imagenRecuperada.zindex=objeto.zindex;

imagenRecuperada.fondoUrl=objeto.fondoUrl;

fondoSeleccionado=objeto.fondoUrl;

this.listaFotosDeEscena.push(imagenRecuperada);
})


this.seleccionarfondo(fondoSeleccionado)
this.listaTexto.forEach(texto=>{

  var Texto = new Image;

  Texto.src=this.value;

  this.ctx.drawImage(Texto,texto.imagenX,texto.imagenY,texto.imagenWidth,texto.imagenHeight);

  this.ctx.fillText(texto.textoString,texto.textoX,texto.textoY);


})

}
recolocarObjeto=false;

async recolocar(){

  this.recolocarObjeto=true;
  
    console.log("READY")
  
    this.listaFotosDeEscena.forEach(element=>{
      var imagenObjeto =  document.getElementById(element.nombre) as HTMLImageElement
  
      imagenObjeto.classList.add('positionAbsolute')
  //document.getElementById(objeto).style.position="absolute
  imagenObjeto.style.zIndex=""+element.zindex+""
  
  
      
      if(element.invertir==-1){
      imagenObjeto.style.transform =
        'translate(' + element.imagenDataX + 'px, ' + element.imagenDataY + 'px) scaleX('+element.invertir+') rotate(' + element.rotate*(-1) + 'rad)'
      }
      else{
  
        imagenObjeto.style.transform =
        'translate(' + element.imagenDataX + 'px, ' + element.imagenDataY + 'px) scaleX('+element.invertir+') rotate(' + element.rotate + 'rad)'
  
      }
        console.log(document.getElementById(element.nombre))
  
        imagenObjeto.setAttribute('data-x',element.imagenDataX);
        imagenObjeto.setAttribute('data-y',element.imagenDataY);
        imagenObjeto.setAttribute('data-angle',element.rotate);
  
        imagenObjeto.width=element.imagenWidth;
        imagenObjeto.height=element.imagenHeight;
    
    })
    this.vaciar();
  }

  vaciar(){

    console.log("1: "+this.listaPersonajesPagina)
    this.listaPersonajesPagina=[];
    console.log("2: "+this.listaPersonajesPagina)
  
  }

  async allMight(){
 
    await this.recuperarPagina();
  
    await this.recolocar();
    
  }






  //Cambio el fondo del  canvas con un click//
  canvasClick()
  {
    var Imagen= new Image;
    Imagen.src=this.fondoPrimero;
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.drawImage(Imagen,0,0,1000,500)




  }

  contadorTexto=0;

  canvasClick2(event){
    
    //this.value='https://i.pinimg.com/originals/56/20/01/5620017c61509710ca24b17a8fa9347d.png'
    this.ctx = this.canvas.nativeElement.getContext('2d');
    var x = event.clientX;
    var y = event.clientY;
    var texto = ''
    texto = this.signalSelected(texto);
    console.log("X: "+x+"Y: "+y)
    console.log("El usuario ha escrito: "+texto+" Tamaño texto: "+texto.length)

    var plusWidth=texto.length

    var prueba =document.getElementById("prueba") as HTMLImageElement;

    this.ctx.drawImage(prueba,(x - (prueba.width/2)),(y - (prueba.height/2)),this.ctx.measureText(texto).width+prueba.width,prueba.height+texto.length*0.25);

    this.ctx.fillText(texto,x,y);

    var textoPrueba = new TextoCuento;
    textoPrueba.textoID=this.contadorTexto;
    textoPrueba.textoString=texto;
    textoPrueba.textoX=x;
    textoPrueba.textoY=y;
    textoPrueba.imagenX=(x - (prueba.width/2));
    textoPrueba.imagenY=(y - (prueba.height/2));
    textoPrueba.imagenWidth=this.ctx.measureText(texto).width+prueba.width
    textoPrueba.imagenHeight=prueba.height+texto.length*0.25
    this.contadorTexto=this.contadorTexto+1;

    this.listaTexto.push(textoPrueba);

    console.log("La lista de textos: "+ this.listaTexto);

    //this.ctx.drawImage(prueba,(x - (prueba.width/2)), (y -(prueba.height/2)) ,prueba.width,prueba.height);




  }

  removeTexto(id) {
    this.listaTexto = this.listaTexto.filter(item => item.textoID !== id);
}

eliminarTexto(){
  this.contadorTexto=this.contadorTexto-1;
    var length = this.listaTexto.length;
    console.log("Length: "+length)
    this.removeTexto(length-1);
    
  
    this.seleccionarfondo(this.fondoElegido);
  
    this.listaTexto.forEach(texto=>{
  
      var Texto = new Image;
  
      Texto.src=this.value;
  
      this.ctx.drawImage(Texto,texto.imagenX,texto.imagenY,texto.imagenWidth,texto.imagenHeight);
  
      this.ctx.fillText(texto.textoString,texto.textoX,texto.textoY);
  
  
    })
  
  
  }






//Selecciono el objeto que quiero y lo añado a la listaFotosDeEscena//
seleccionarobjeto(imageO: ImagenToBackend)
{
  this.listaFotosDeEscena.push(imageO);




}



//Selecciono el fondo que quiero//
fondoElegido='';
  seleccionarfondo(urlrwae: string){
         
    var Imagen = new Image;
   Imagen.src=urlrwae
   this.fondoElegido=urlrwae;
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.drawImage(Imagen,0,0,1000,500)
  
  
 
         
    }
/*
  seleccionarfondo(urlrwae: string){
         
    var img3 = new Image();
   // img3.src = foto.url;
    console.log('URL de foto');
    console.log(urlrwae);
   this.value = urlrwae;
   this.fondoPrimero= urlrwae;
   this.canvasClick();
    // img3.src = '../../assets/imgs/fondo1.jpg';
    img3.width = 900;
    img3.height = 900; 
   console.log(img3.src);
   localStorage.setItem("src", "tengo");  
   this.dataService.setDataRecursos(500, foto.nombre);
   this.dataService.setDataRecursos(501, foto.url);
   var idEscena = localStorage.getItem("idEscena");
   this.router.navigateByUrl("/cuentocanvas/" + idEscena);
         
    }
*/



//chupo las imagenes de mi recurso que hay en la api//
  traeImagenesRecursoLibro(){
  

    this.listaFotosPersonajes = [];
    this.listaFotosFondos  = [];
    this.listaFotosObjetos = [];

    this.recursoCargadoPregunta = true;
    console.log('This');
   // this.recursoCargado = this.listaRecursos.filter (recuro => recuro.id === Number(this.recursoId))[0];
console.log('id: ')
console.log(this.listaRecursos[0].id);

   this.recursoCargado = this.listaRecursos.filter (recuro => recuro.id === this.listaRecursos[0].id)[0];

    console.log(this.listaRecursos);
    console.log(this.recursoCargado);

    this.recursoCargado.imagenes.forEach(element => {
      
      this.dBservice.getImagenesRecurso(this.recursoCargado.carpeta, element.nombre)
      .subscribe((res)=>{
        
        const blob = new Blob([res.blob()], { type: 'image/png' });
        const reader = new FileReader();

        reader.addEventListener('load', () => {

          var foto = null;
          foto = reader.result.toString();
          var fotoProps = new ImagenToBackend();
          fotoProps.url = foto;
          if(element.especial == true)
          {
            fotoProps.especial = "Especial"
          }
          else
          {
            fotoProps.especial == ""
          }

          fotoProps.nombre = element.nombre


          if (element.tipo == "fondo")
          {
            this.listaFotosFondos.push(fotoProps);
          }
          else if (element.tipo == "personaje")
          {
            this.listaFotosPersonajes.push(fotoProps);

          }
          else if (element.tipo == "objeto")
          {
            this.listaFotosObjetos.push(fotoProps);

          }

        }, false);

        if (blob) {
          reader.readAsDataURL(blob);
        }


      }, (err)=>{

        console.log(err);
      })

    });
    console.log('end')
  }
  




  //Recuperamos la lista de recursos donde se encuentran las imagenes para la app//
 recuperarListaRecursos() {
    this.listaRecursos = [];
//ponia el valor 1//

   /*this.dBservice.recuperarListaRecursos(1)
      .subscribe((res) => {
        console.log(1);
        this.listaRecursos = res;
        console.log(this.listaRecursos);
      }, (err) => {

      })*/
      this.dBservice.recuperarListaRecursosJuego(localStorage.getItem("idJuego"))
      .subscribe((res) => {
        console.log(1);
        this.listaRecursos = res;
        console.log(this.listaRecursos);
      }, (err) => {

      })


  }



  ////
  //Funcion que que voltea //
  ////
  invertir(){

    var arrow= document.getElementById("prueba")
    document.getElementById("prueba").classList.remove('draggable');
    document.getElementById("prueba").classList.remove('drag-rotate');
    document.getElementById("prueba").classList.remove('resize-drag');
    this.resizeAngle=false;

      var x = arrow.dataset.x;
      var y = arrow.dataset.y;
    
    if(this.girarImagen==0)
    {
    
      if (typeof x != 'undefined' && typeof y != 'undefined') {
        arrow.style.transform = 'translate(' + x + 'px, ' + y + 'px) scaleX(-1)';
      } else {
        arrow.style.transform = 'scaleX(-1)';
      }
    
      this.girarImagen=1
    }else
    {
      console.log("ENTRAMOS AL ELSE")
      if (typeof x != 'undefined' && typeof y != 'undefined') {
        arrow.style.transform = 'translate(' + x + 'px, ' + y + 'px) scaleX(1)';
      } else {
    
        arrow.style.transform = 'scaleX(1)';
      }
    
      this.girarImagen=0;
    
    
    }
    
    }

    resizeAngle=false;
    primeroResize=false;


  ////
  //Función que sirve para agrandar o disminuir el tamaño de la imagen//
  ////
  resize(){
    this.primeroResize=true;
    console.log("CAMBIAMOS TAMAÑO");
    this.elementoGirar='null'
    
    this.resizeAngle=true;
  
    //document.getElementById("prueba").classList.remove('resize-drag');
    document.getElementById("prueba").classList.remove('#rotate-area');
    document.getElementById("prueba").classList.remove('draggable');
    document.getElementById("prueba").classList.add('resize-drag');
  
    console.log("Lista recibida en resize: "+this.listaFotosDeEscena)
    this.listaFotosDeEscena.forEach(element => {
      console.log(element.nombre);
    document.getElementById(element.nombre).classList.add('resize-drag');
    document.getElementById(element.nombre).classList.add('cajita');
    document.getElementById(element.nombre).classList.remove('draggable');
    document.getElementById(element.nombre).classList.remove('drag-rotate');
    });
  
    var lista=this.listaFotosDeEscena;
  
  console.log(document.getElementById("prueba"))
  
  
    interact('.resize-drag')
    .resizable({
      // resize from all edges and corners
      edges: { left: false, right: true, bottom: true, top: false },
  
      listeners: {
        move (event) {
  
          var target = event.target
          var x = (parseFloat(target.getAttribute('data-x')) || 0)
          var y = (parseFloat(target.getAttribute('data-y')) || 0)
  
          var invertir = 1
  
          lista.forEach(element => {
      
         if(document.getElementById(element.nombre)==event.target)
         {
          document.getElementById(element.nombre).classList.remove('#rotate-area');
           invertir=element.invertir;
         }
        })
  
          // update the element's style
          target.style.width = event.rect.width + 'px'
          target.style.height = event.rect.height + 'px'
  
          // translate when resizing from top or left edges
          x += event.deltaRect.left
          y += event.deltaRect.top
  
          var rotation = (parseFloat(target.getAttribute('data-angle')) || 0) 
  
          target.style.webkitTransform = target.style.transform =
            'translate(' + x + 'px,' + y + 'px) scaleX('+invertir+') rotate('+rotation+'rad); position: absolute;z-index:2'
  
  
          target.setAttribute('data-x', x)
          target.setAttribute('data-y', y)
          target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height)
  
        
  
  
        }
      },
      modifiers: [
        // keep the edges inside the parent
        interact.modifiers.restrictEdges({
          outer: 'parent'
        }),
  
        // minimum size
        interact.modifiers.restrictSize({
          min: { width: 100, height: 50 }
        })
      ],
  
      inertia: true
    })
  }


  ////
  //Función que sirve para modificar la orientacion de la imagen//
  ////
  arregloGirar(){
    if(this.primeroGiro==false)
    {
      this.girar();
      this.primeroGiro=true;
    }else if(this.primeroGiro==true)
    {
      this.girar();
      this.girar();
    }
  }

  primeroGiro=false;

  girar(){ 
    var angle = 0
    console.log(document.getElementById("prueba"));
    document.getElementById("prueba").classList.add('drag-rotate');
    var scaleGirar = this.scaleXGirar;
   
    this.resizeAngle=false;
  
    console.log('bUENAS')
  
    var lista = this.listaFotosDeEscena
    var elementoGirar1=this.elementoGirar;
  
    this.listaFotosDeEscena.forEach(element => {
      console.log(element.nombre);
    document.getElementById(element.nombre).classList.add('drag-rotate');
    document.getElementById(element.nombre).classList.remove('draggable');
    document.getElementById(element.nombre).classList.remove('resize-drag');
    document.getElementById(element.nombre).classList.remove('cajita');
    });
  
    interact('.drag-rotate')
    .draggable({
    onstart: function (event) {
      const element = event.target;
      const rect = element.getBoundingClientRect();
  
      // store the center as the element has css `transform-origin: center center`
      element.dataset.centerX = rect.left + rect.width / 2;
      element.dataset.centerY = rect.top + rect.height / 2;
      // get the angle of the element when the drag starts
      element.dataset.angle = getDragAngle(event);
    },
    onmove: function (event) {
      var element = event.target;
      var center = {
        x: parseFloat(element.dataset.centerX) || 0,
        y: parseFloat(element.dataset.centerY) || 0,
      };
      var angle = getDragAngle(event);
  
      var invertir = 1
  
          lista.forEach(element => {
      
         if(document.getElementById(element.nombre)==event.target)
         {
           invertir=element.invertir;
         }
        })
  
  
      // update transform style on dragmove
  
      var x = element.dataset.x;
      var y = element.dataset.y;
      
  
  
     // element.style.transform = 'rotate(' + angle + 'rad' + ') scaleX('+invertir+')';
      if (typeof x != 'undefined' && typeof y != 'undefined') {
        element.style.transform = 'translate(' + x + 'px, ' + y + 'px) rotate(' + angle + 'rad) scaleX('+invertir+')';
      } else {
        element.style.transform = 'rotate(' + angle + 'rad' + ') scaleX('+invertir+')';
      }
  
  
    },
    onend: function (event) {
      const element = event.target;
  
      // save the angle on dragend
      element.dataset.angle = getDragAngle(event);
    },
  })
  
  function getDragAngle(event) {
    var element = event.target;
    var startAngle = parseFloat(element.dataset.angle) || 0;
    var center = {
      x: parseFloat(element.dataset.centerX) || 0,
      y: parseFloat(element.dataset.centerY) || 0,
    };
    var angle = Math.atan2(center.y - event.clientY,
                           center.x - event.clientX);
  /*
    lista.forEach(elementoGirado=>{
    
    elementoGirado.rotate= angle - startAngle
                      
    })
  */
    return angle - startAngle;
  }
  
  /*
    interact('#rotate-area').gesturable({
      listeners: {
        move (event) {
  
          lista.forEach(element =>{
  
            if(elementoGirar1==element.nombre)
            {
  
  
          var arrow = document.getElementById(element.nombre);
          console.log('De revens')
  
          var x = arrow.dataset.x;
          var y = arrow.dataset.y;
          
  
          angle += event.da
          
          var invertir = 1
  
          lista.forEach(element => {
      
         if(document.getElementById(element.nombre)==event.target)
         {
           invertir=element.invertir;
         }
        })
  
          if (typeof x != 'undefined' && typeof y != 'undefined') {
            arrow.style.transform = 'translate(' + x + 'px, ' + y + 'px) rotate(' + angle + 'deg' + ') scaleX('+scaleGirar+')';
          } else {
            arrow.style.transform = 'rotate(' + angle + 'deg' + ') scaleX('+scaleGirar+')';
          }
  
        }
          })
        
  
        }
      }
    })
  
    */
  
  
  
  }
  desplegarTexto(){

    var checkList = document.getElementById('list1');
      if (checkList.classList.contains('visible'))
        checkList.classList.remove('visible');
      else
        checkList.classList.add('visible');
  
  }
  modoTexto(){
    this.listaFotosDeEscena.forEach(element => {
      document.getElementById(element.nombre).classList.remove('#rotate-area');
        
        document.getElementById(element.nombre).classList.remove('draggable');
      document.getElementById(element.nombre).classList.remove('resize-drag');
    })
  
    var ul = document.getElementById("inputs");
    
  
    this.listaTexto.forEach(obj=>{
    var li = document.createElement("li");
    li.setAttribute("type","checkbox")
  li.setAttribute("id",""+obj.textoID+"")
  
    li.addEventListener('click', (e) => {
      this.removeTextoDesdeLista(li);//your typescript function
  });
  
    li.appendChild(document.createTextNode(obj.textoString));
    ul.appendChild(li);
  
    })
    
  
        
    
  }
  removeTextoDesdeLista(element:any){
    var id = element.getAttribute("id");
    console.log(element)
    console.log("Id a eliminar: "+id)
    this.removeTexto(id)
  
    this.seleccionarfondo(this.fondoElegido);
  
    this.listaTexto.forEach(texto=>{
  
      var Texto = new Image;
  
      Texto.src=this.value;
  
      this.ctx.drawImage(Texto,texto.imagenX,texto.imagenY,texto.imagenWidth,texto.imagenHeight);
  
      this.ctx.fillText(texto.textoString,texto.textoX,texto.textoY);
  
  
    })
    
  
  }


//Arrastro de momento todos los objetos que he añadido a la funcion listaFOtosDeEscena//
primeroArrastro=false;

arrastrar22222222222(){
this.primeroArrastro=true;

  this.clase="draggable";
    console.log("llamamos a funcion arrastrar");
    console.log(this.listaFotosDeEscena);

    this.resizeAngle=false;

    var lista=this.listaFotosDeEscena;

   this.listaFotosDeEscena.forEach(element => {
      console.log(element.nombre);
    document.getElementById(element.nombre).classList.remove('drag-rotate');
    document.getElementById(element.nombre).classList.add('draggable');
    document.getElementById(element.nombre).classList.remove('resize-drag');
    document.getElementById(element.nombre).classList.remove('cajita');
    });

    //document.getElementById("hola").classList.add('draggable');
    console.log(this.listaFotosDeEscena[0]);
    
    /*document.getElementById("imageF.nombre").classList.remove('#rotate-area');
    document.getElementById("imageF.nombre").classList.remove('resize-drag');
    document.getElementById("imageF.nombre").classList.add('draggable');*/
    console.log(document.getElementById("prueba"))
  
  
  interact('.draggable')
    .draggable({
      // enable inertial throwing
      inertia: true,
      // keep the element within the area of it's parent
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent',
          endOnly: true
        })
      ],
      // enable autoScroll
      autoScroll: true,
  
      listeners: {
        // call this function on every dragmove event
        move: dragMoveListener,
  
        // call this function on every dragend event
        end (event) {
          var textEl = event.target.querySelector('p')
  
          textEl && (textEl.textContent =
            'moved a distance of ' +
            (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
                       Math.pow(event.pageY - event.y0, 2) | 0))
              .toFixed(2) + 'px')
        }
      }
    })
  
  function dragMoveListener (event) {
    
    var invertir = 1
    var target = event.target
    var rotation = (parseFloat(target.getAttribute('data-angle')) || 0) 
    var rotate=0;
    lista.forEach(element => {

   if(document.getElementById(element.nombre)==event.target)
   {
     invertir=element.invertir;
     rotate=element.rotate;
   }
  })
    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
  
   var j = target.dataset.angle;

   console.log("ANGULO: "+j)
  
   
    // translate the element
    target.style.webkitTransform =
      target.style.transform =
      'translate(' + x + 'px,' + y + 'px) rotate(' + rotation + 'rad) scaleX('+invertir+')';
  
    // update the posiion attributes
    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)
  
  }
  
  // this function is used later in the resizing and gesture demos
  window.dragMoveListener = dragMoveListener
  }






////
//Funcion que sirve para arrastrar la imagen//
////
arrastrar(){
  this.clase="draggable";
    console.log("llamamos a funcion arrastrar");
    //document.getElementById("hola").classList.add('draggable');
    document.getElementById("prueba").classList.remove('#rotate-area');
    document.getElementById("prueba").classList.remove('resize-drag');
    document.getElementById("prueba").classList.add('draggable');
    console.log(document.getElementById("prueba"))
  var prueba34=this.prueba34;
  
  interact('.draggable')
    .draggable({
      // enable inertial throwing
      inertia: true,
      // keep the element within the area of it's parent
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent',
          endOnly: true
        })
      ],
      // enable autoScroll
      autoScroll: true,
  
      listeners: {
        // call this function on every dragmove event
        move: dragMoveListener,
  
        // call this function on every dragend event
        end (event) {
          var textEl = event.target.querySelector('p')
  
          textEl && (textEl.textContent =
            'moved a distance of ' +
            (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
                       Math.pow(event.pageY - event.y0, 2) | 0))
              .toFixed(2) + 'px')
        }
      }
    })
  
  function dragMoveListener (event) {
    var target = event.target
    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
  
   var rotation = (parseFloat(target.getAttribute('data-angle')) || 0) 
  
   console.log(rotation);
    // translate the element
    target.style.webkitTransform =
      target.style.transform =
      'translate(' + x + 'px,' + y + 'px) rotate(' + rotation + 'rad) scaleX('+prueba34+')';
  
    // update the posiion attributes
    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)
  
  }
  
  // this function is used later in the resizing and gesture demos
  window.dragMoveListener = dragMoveListener
  }
  }



declare global {
  interface Window {
    dragMoveListener:any;
  }
}

//let FB = window.dragMoveListener; // ok now













