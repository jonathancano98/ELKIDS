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
 
  girarImagen=0;
  value='';

  

  listaFotosPersonajes: any[] = [];
  listaFotosFondos: any[] = [];
  listaFotosObjetos: any[] = [];
  listaFotosDeEscena: any[] = [];

  listaTexto: TextoCuento[]=[];

  listaPersonajesPagina: PersonajesPagina[] = []
  listaReordenarCanvas: PersonajesPagina[]=[]
  listaModoEdicion: PersonajesPagina[]=[]


  listaRecursos: any[] = [];
  recursoId: Number;
  recursoCargadoPregunta: any = false;
  recursoCargado: any;
  personajePagina: PersonajesPagina;


  mark: string;
  prueba34=-1;

  //Ambas variables utilizadas para declarar el source de los tÃ­tulos Personajes y Objetos en pantalla.
  imagenPersonajes='';
  imagenObjetos=''

  async ngOnInit() {
   var resY= window.screen.availHeight
   var resX= window.screen.availWidth
   console.log("Resolucion:" + resX+","+resY)
   if(resX==1024)
   document.getElementById("canvas").classList.add("canvasSize");
   else
   document.getElementById("canvas").classList.add("canvasSizeOriginal");
    
    //Recuperamos la lista de recursos donde se encuentran las imagenes para la app//
    await this.recuperarListaRecursos();

    //Cargamos la imagen que vamos a usar para realizar los bocadillos de texto.
    var bocadilloImagen = new Image;
    bocadilloImagen.src='../../assets/icon/bocadillo.png'
    this.value=bocadilloImagen.src
    //Cargamos la imagen con el tÃ­tulo Personajes y lo colocamos en la posiciÃ³n deseada utilizando el style.
    var Personajes = new Image;
    Personajes.src='../../assets/icon/Personajes.png'
    this.imagenPersonajes=Personajes.src;
    var imagenPersonaje =  document.getElementById("imagenPersonajes") as HTMLImageElement
    imagenPersonaje.style.transform =
    'translate(' + (-25) + 'px, ' + (-25) + 'px)'
    imagenPersonaje.setAttribute('data-x',''+(-25)+'');
    imagenPersonaje.setAttribute('data-y',''+(-25)+'');

    //Cargamos la imagen con el tÃ­tulo Objetos y lo colocamos en la posiciÃ³n deseada utilizando el style.
    var Objetos = new Image;
    Objetos.src='../../assets/icon/Objetos.png'
    this.imagenObjetos=Objetos.src;
    var imagenObjeto =  document.getElementById("imagenObjetos") as HTMLImageElement
    imagenObjeto.style.transform =
    'translate(' + (250) + 'px, ' + (-25) + 'px)'
    imagenObjeto.setAttribute('data-x',''+(250)+'');
    imagenObjeto.setAttribute('data-y',''+(-25)+'');

    //Utilizamos la funciÃ³n delay para esperar la carga completa de todas las imÃ¡genes.
    await this.delay(200)

    //Traemos las imagenes de mi recurso que hay en la API.
    this.traeImagenesRecursoLibro()

    //Utilizamos la funciÃ³n delay para esperar la carga completa de mi recurso que hay en la API.
    await this.delay(500)

    //AÃ±adimos en pantalla las imagenes que son objetos.
    this.cargoObjetos()
 
    //AÃ±adimos en pantalla las imagenes que son personajes.
    this.cargoPersonajes()

  }

  //Copia el texto que ha escrito el usuario y hace un return del texto.
  copiarTexto (markVal: string){
    markVal = this.mark
     return markVal;
}

//Cargo las imagenes que son Personajes para mostrarlos en pantalla.
cargoPersonajes(){
 this.listaFotosPersonajes.forEach(element=>{
 var imagenPersonaje = new ImagenToBackend;
 imagenPersonaje=element;
 this.seleccionarobjeto(imagenPersonaje,"Personaje")
  })
}

//Cargo las imagenes que son Objetos para mostrarlos en pantalla.
cargoObjetos(){
  this.listaFotosObjetos.forEach(element=>{
  console.log(element)
  var imagenPersonaje = new ImagenToBackend;
  imagenPersonaje=element;
  this.seleccionarobjeto(imagenPersonaje,"Objeto")
   })
}


/*Esta variable incrementa en 1 cada vez que se interactua con una imagen
de esta manera podremos saber en que orden del eje Z se deben encontrar las imagenes
*/
zIndexImagenes=0;

/**
 * 
 * @param objeto Le pasamos la id de la imagen con la que estamos interactuando.
 * @param event Parametro event para interactuar con eventos.
 */
/*Funcion que determina la posiciÃ³n de las imagenes en el eje Z siendo el que estÃ¡ por encima de los demÃ¡s
el Ãºltimo con el que se ha interactuado.

AdemÃ¡s si la imagen se encuentra girada, y te encuentras en el modo resize, con esta funciÃ³n dejamos el angulo de la imagen a 0.
*/
organizarEjeZ(objeto:any,event){
 document.getElementById(objeto).classList.add('positionAbsolute')
 
 document.getElementById(objeto).style.zIndex=""+this.zIndexImagenes+""
 this.zIndexImagenes=this.zIndexImagenes+1;

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

    target.style.transform =
    'translate(' + x + 'px,' + y + 'px) scaleX('+scaleX+')';

  }

  console.log(document.getElementById(objeto));

}

/**
 *
 * @param objeto Le pasamos la id de la imagen con la que estamos interactuando.
 * @param event Parametro event para interactuar con eventos.
 */
//FunciÃ³n encargada de voltear la imagen, o tambiÃ©n llamado poner la imagen en modo espejo.
voltearImagen(objeto:any,event)
{
  //Recorremos la lista para conocer el estado de la imagen.
  this.listaFotosDeEscena.forEach(obj=>{
   var imagenObjeto= document.getElementById(objeto)
   //Eliminamos el modo resize.
   if(obj.nombre==objeto){
    document.getElementById(obj.nombre).classList.remove('cajita');
    document.getElementById(obj.nombre).classList.remove('cajitaInvertida');
    document.getElementById(obj.nombre).classList.remove('resize-drag');
    }
    //Cambiamos el style de la imagen para invertirla.
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
    //Cambiamos el style de la imagen para invertirla.
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

//Contador utilizado para aÃ±adir ID propia por pÃ¡gina a cada Personaje/Objeto que hay en pantalla.
contadorIDPersonajes=0;

numeroPaginas=0;
//FunciÃ³n encargada de pintar todo en el canvas y guardar imagen.
crearPagina(){
 //Recorremos la lista encargada de mostrar los Personajes/Objetos en pantalla.
this.listaFotosDeEscena.forEach(obj=>{
 //Por cada personaje/objeto que hay en la lista, creamos un nuevo personaje/objeto
  var imagendeEscena= new PersonajesPagina;

  imagendeEscena.personajeID=this.contadorIDPersonajes;
  this.contadorIDPersonajes=this.contadorIDPersonajes+1;
  imagendeEscena.nombre=obj.nombre;
  //Por cada personaje/objeto guardamos su informaciÃ³n en el elemento creado previamente.
  var imagenObjeto = document.getElementById(obj.nombre) as HTMLImageElement & HTMLCanvasElement
  imagendeEscena.imagenWidth=imagenObjeto.width;
  imagendeEscena.imagenHeight=imagenObjeto.height;
  imagendeEscena.invertir=obj.invertir;
  imagendeEscena.rotate=(parseFloat(imagenObjeto.getAttribute('data-angle')) || 0);
  imagendeEscena.zindex=imagenObjeto.style.zIndex.valueOf();
  imagendeEscena.canvasX=imagenObjeto.getBoundingClientRect().left;
  imagendeEscena.canvasY=imagenObjeto.getBoundingClientRect().top;
  //Guardamos tambiÃ©n el fondo en el que se encuentra el personaje/objeto
  imagendeEscena.fondoUrl=this.fondoElegido;
  imagendeEscena.imagenDataX =parseFloat(imagenObjeto.getAttribute('data-x'));
  imagendeEscena.imagenDataY = parseFloat(imagenObjeto.getAttribute('data-y'));
  imagendeEscena.especial=obj.especial;
  imagendeEscena.id=obj.id;
  imagendeEscena.tipo=obj.tipo;
  imagendeEscena.url=obj.url;
  imagendeEscena.positionlista=obj.positionlista;
  imagendeEscena.translate=imagenObjeto.getAttribute('style');

  //AÃ±adimos cada personaje/objeto a la lista
  this.listaPersonajesPagina.push(imagendeEscena);

})

/*
Vaciamos la lista que muestras los Personajes/Objetos, para asÃ­
poder reordenar los Personajes/Objetos en pantalla
*/
this.listaFotosDeEscena=[];

/*
VacÃ­amos los contadores de ID independientes por pÃ¡gina, tanto
de personajes/objetos como de texto.
*/
this.contadorTexto=0;
this.contadorIDPersonajes=0;

//llamamos a las funciones encargadas de pintar el canvas
this.drawCanvas();
this.pruebaCanvasUrl();

//AÃ±adimos un delay para darle tiempo a leer todo el cÃ³digo
this.delay(50);

//Reiniciamos los contadores encargardos de recolocar los Personajes/objetos en pantalla
this.contadorColocadorObjetoX=0;
this.contadorColocadorObjetoY=1;
this.contadorColocadorPersonajeX=0;
this.contadorColocadorPersonajeY=1;

//Volvemos a cargar los personajes/objetos para mostrarlos en pantalla
this.cargoObjetos() 
this.cargoPersonajes()

//Limpiamos el canvas dejandolo en blanco
this.ctx.clearRect(0, 0, 1000, 500);

//Vaciamos el fondoElegido
this.fondoElegido='';

//Vaciamos la lista de texto
this.listaTexto.forEach(texto=>{
  this.removeTexto(texto.textoID)
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


 compararEjeZ( a, b ) {
  if ( a.zindex < b.zindex ){
    return -1;
  }
  if ( a.zindex > b.zindex ){
    return 1;
  }
  return 0;
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

  this.listaPersonajesPagina.sort(this.compararEjeZ);

  this.listaReordenarCanvas=this.listaPersonajesPagina
  this.listaModoEdicion=this.listaPersonajesPagina

  this.listaPersonajesPagina=[]

  var Imagen = new Image;
  var angle=0;
  this.listaReordenarCanvas.forEach(objeto=>{

  angle=objeto.rotate*(180/Math.PI);
  Imagen.src=objeto.url;
 
  this.ctx = this.canvas.nativeElement.getContext('2d');




  if(objeto.invertir==-1 && objeto.rotate==0)
  {
    this.ctx.save();
    this.ctx.translate(objeto.canvasX+objeto.imagenWidth/2,0);
  //this.ctx.rotate(objeto.rotate)
  this.ctx.scale(-1,1)
 
  this.ctx.drawImage(Imagen,-objeto.imagenWidth/2,objeto.canvasY,objeto.imagenWidth,objeto.imagenHeight)
 this.ctx.restore();

  }else if(objeto.invertir==1 && objeto.rotate==0)
  {
    this.ctx.save();
  

    this.ctx.drawImage(Imagen,objeto.canvasX,objeto.canvasY,objeto.imagenWidth,objeto.imagenHeight)

    

    this.ctx.restore();
  }else if(objeto.invertir==1 && objeto.rotate!=0){

    this.ctx.save();

    
    this.ctx.translate(objeto.canvasX+objeto.imagenWidth/2,objeto.canvasY+objeto.imagenHeight/2);
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

this.listaModoEdicion.forEach(objeto=>{

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
  var fondoSeleccionado=''
    this.listaFotosDeEscena.forEach(element=>{

      
      
    this.listaModoEdicion.forEach(edicion=>{
      fondoSeleccionado=edicion.fondoUrl;
      if(element.nombre==edicion.nombre){

      var imagenObjeto =  document.getElementById(element.nombre) as HTMLImageElement
  
      imagenObjeto.classList.add('positionAbsolute')
  //document.getElementById(objeto).style.position="absolute
  imagenObjeto.style.zIndex=""+edicion.zindex+""
  
  
      
      if(edicion.invertir==-1){
      imagenObjeto.style.transform =
        'translate(' + edicion.imagenDataX + 'px, ' + edicion.imagenDataY + 'px) scaleX('+edicion.invertir+') rotate(' + edicion.rotate*(-1) + 'rad)'
      }
      else{
  
        imagenObjeto.style.transform =
        'translate(' + edicion.imagenDataX + 'px, ' + edicion.imagenDataY + 'px) scaleX('+edicion.invertir+') rotate(' + edicion.rotate + 'rad)'
  
      }
        
  
        imagenObjeto.setAttribute('data-x',edicion.imagenDataX);
        imagenObjeto.setAttribute('data-y',edicion.imagenDataY);
        imagenObjeto.setAttribute('data-angle',edicion.rotate);
  
        imagenObjeto.width=edicion.imagenWidth;
        imagenObjeto.height=edicion.imagenHeight;
    

    }
    })
    })
    this.delay(50)
    this.seleccionarfondo(fondoSeleccionado)
    this.vaciar();
  }

  vaciar(){

    console.log("1: "+this.listaPersonajesPagina)
    this.listaPersonajesPagina=[];
    console.log("2: "+this.listaPersonajesPagina)
  
  }

  async allMight(){

    await this.recolocar();    
  }

  contadorTexto=0;

  canvasClick2(event){
    
    if(this.fondoElegido==''){
      return;
    }
    
    this.ctx = this.canvas.nativeElement.getContext('2d');
    var x = event.clientX;
    var y = event.clientY;
    var texto = ''
    texto = this.copiarTexto(texto);
    console.log("X: "+x+"Y: "+y)
    console.log("El usuario ha escrito: "+texto+" TamaÃ±o texto: "+texto.length)

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

    
    var ul = document.getElementById("inputs");
    var li = document.createElement("li");

    li.setAttribute("type","checkbox")
  li.setAttribute("id",""+textoPrueba.textoID+"")
  
    li.addEventListener('click', (e) => {
      this.removeTextoDesdeLista(li);//your typescript function
  });
  
    li.appendChild(document.createTextNode(textoPrueba.textoString));
    ul.appendChild(li);



  }










//Selecciono el objeto que quiero y lo aÃ±ado a la listaFotosDeEscena//
delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

contadorColocadorObjetoX=0;
contadorColocadorObjetoY=1;

contadorColocadorPersonajeX=0;
contadorColocadorPersonajeY=1;

async seleccionarobjeto(imageO: ImagenToBackend,imagenNombre)
{
  console.log("Nombre: "+imageO.nombre)

this.listaFotosDeEscena.push(imageO);
await this.delay(50)

if(imagenNombre=='Objeto'){
  var imagenObjeto =  document.getElementById(imageO.nombre) as HTMLImageElement

  imagenObjeto.style.transform =
        'translate(' + (50*this.contadorColocadorObjetoX+250) + 'px, ' + 40*this.contadorColocadorObjetoY + 'px)'
        imagenObjeto.setAttribute('data-x',''+(50*this.contadorColocadorObjetoX+250)+'');
        imagenObjeto.setAttribute('data-y',''+40*this.contadorColocadorObjetoY+'');
imagenObjeto.style.width='65px';
imagenObjeto.style.height='65px';
imagenObjeto.style.rotate='0'

  this.contadorColocadorObjetoX++;

  if(this.contadorColocadorObjetoX>=4){
    this.contadorColocadorObjetoY++;
    this.contadorColocadorObjetoX=0;
    
  }
}else if(imagenNombre=='Personaje'){
  var imagenPersonaje =  document.getElementById(imageO.nombre) as HTMLImageElement

  imagenPersonaje.style.transform =
        'translate(' + 50*this.contadorColocadorPersonajeX + 'px, ' + 40*this.contadorColocadorPersonajeY + 'px)'
        imagenPersonaje.setAttribute('data-x',''+50*this.contadorColocadorPersonajeX+'');
        imagenPersonaje.setAttribute('data-y',''+40*this.contadorColocadorPersonajeY+'');
  imagenPersonaje.style.width='65px';
  imagenPersonaje.style.height='65px';
  imagenPersonaje.style.rotate='0'

  this.contadorColocadorPersonajeX++;

  if(this.contadorColocadorPersonajeX>=4){
    this.contadorColocadorPersonajeY++;
    this.contadorColocadorPersonajeX=0;
    
  }

}

}



//Selecciono el fondo que quiero//
fondoElegido='';
  seleccionarfondo(urlrwae: string){


    var Imagen = new Image;
   Imagen.src=urlrwae
   this.fondoElegido=urlrwae;
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.drawImage(Imagen,0,0,1000,500)

    this.listaTexto.forEach(texto=>{

      var Texto = new Image;
  
      Texto.src=this.value;
  
      this.ctx.drawImage(Texto,texto.imagenX,texto.imagenY,texto.imagenWidth,texto.imagenHeight);
  
      this.ctx.fillText(texto.textoString,texto.textoX,texto.textoY);

  
  
    })
  
  
 
         
    }




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
 async recuperarListaRecursos() {
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
  //FunciÃ³n que sirve para agrandar o disminuir el tamaÃ±o de la imagen//
  ////
  resize(){
    this.primeroResize=true;
    console.log("CAMBIAMOS TAMAÃ‘O");
   
    
    this.resizeAngle=true;
  
    //document.getElementById("prueba").classList.remove('resize-drag');
    document.getElementById("prueba").classList.remove('#rotate-area');
    document.getElementById("prueba").classList.remove('draggable');
    document.getElementById("prueba").classList.add('resize-drag');
  
    console.log("Lista recibida en resize: "+this.listaFotosDeEscena)
    this.listaFotosDeEscena.forEach(element => {
      console.log(element.nombre);
    document.getElementById(element.nombre).classList.add('resize-drag');
    if(element.invertir==-1){
    document.getElementById(element.nombre).classList.add('cajitaInvertida');
    }
    else if (element.invertir==1){
      document.getElementById(element.nombre).classList.add('cajita');
    }
    document.getElementById(element.nombre).classList.remove('draggable');
    document.getElementById(element.nombre).classList.remove('drag-rotate');
    });
  
    var lista=this.listaFotosDeEscena;
  
  console.log(document.getElementById("prueba"))
  
  
    interact('.resize-drag')
    .resizable({
      // resize from all edges and corners
      edges: { left: false, right: true, bottom: true, top: false },
      margin: 75,
     
      listeners: {
        move (event) {
  
          var target = event.target
          
          var x = (parseFloat(target.getAttribute('data-x')) || 0)
          var y = (parseFloat(target.getAttribute('data-y')) || 0)
  
          console.log("x: "+x+" y: "+y)

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
  //FunciÃ³n que sirve para modificar la orientacion de la imagen//
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
  
   
    this.resizeAngle=false;
  
    console.log('bUENAS')
  
    var lista = this.listaFotosDeEscena
  
    this.listaFotosDeEscena.forEach(element => {
      console.log(element.nombre);
    document.getElementById(element.nombre).classList.add('drag-rotate');
    document.getElementById(element.nombre).classList.remove('draggable');
    document.getElementById(element.nombre).classList.remove('resize-drag');
    document.getElementById(element.nombre).classList.remove('cajita');
    document.getElementById(element.nombre).classList.remove('cajitaInvertida');
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

    return angle - startAngle;
  }
  
  
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
  removeTexto(id) {
    
    console.log("ANTES:")
    this.listaTexto.forEach(element=>{
      console.log("String: "+element.textoString+" ID: "+element.textoID)
    })

    this.listaTexto = this.listaTexto.filter(item => item.textoID !== id);
    console.log("LONGITUD DEL TEXTO: "+this.listaTexto.length)
    console.log("DESPUES:")
    this.listaTexto.forEach(element=>{
      console.log("String: "+element.textoString+" ID: "+element.textoID)
    })

    

    document.getElementById(id).remove();
    
}
  removeTextoDesdeLista(element:any){
    var id = parseFloat(element.getAttribute("id"));
  
    console.log("Id a eliminar: "+id)

    this.removeTexto(id)

    this.seleccionarfondo(this.fondoElegido);

      
  }
  eliminarTexto(){
    this.contadorTexto=this.contadorTexto-1;
    var IDmasGrande='0' 
    this.listaTexto.forEach(texto=>{
      if(texto.textoID>=IDmasGrande){
        IDmasGrande=texto.textoID
      }
    })
      this.removeTexto(parseFloat(IDmasGrande));
      
      this.seleccionarfondo(this.fondoElegido);
    
    }

//Arrastro de momento todos los objetos que he aÃ±adido a la funcion listaFOtosDeEscena//
primeroArrastro=false;

arrastrar22222222222(){
this.primeroArrastro=true;

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
    document.getElementById(element.nombre).classList.remove('cajitaInvertida');
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

























