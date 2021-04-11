import { Component, OnInit } from '@angular/core';
import{DbServiceService} from 'src/app/db-service.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-visor-de-escenas',
  templateUrl: './visor-de-escenas.page.html',
  styleUrls: ['./visor-de-escenas.page.scss'],
})
export class VisorDeEscenasPage implements OnInit {

  constructor(private router: Router, private dBservice: DbServiceService) { }

  ngOnInit() {
    console.log("lets go")
  }

  Atras()
  {
    this.router.navigate(['/menu-libro']);

  }

}
