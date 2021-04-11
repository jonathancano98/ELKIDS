import { Component, OnInit } from '@angular/core';
import{DbServiceService} from 'src/app/db-service.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-libro',
  templateUrl: './menu-libro.page.html',
  styleUrls: ['./menu-libro.page.scss'],
})
export class MenuLibroPage implements OnInit {

  constructor(private router: Router, private dBservice: DbServiceService) { }

  ngOnInit() {
    console.log("Entramos a menuLibro")
  }

  public irVisorEscenas() {

    this.router.navigate(['/visor-de-escenas']);

  }

  public irCuento(){

    this.router.navigate(['/home']);
  }

  public Atras() {

    this.router.navigate(['/inicio']);

  }

}
