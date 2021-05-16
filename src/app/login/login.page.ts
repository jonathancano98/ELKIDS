import { Component, OnInit } from '@angular/core';
import{DbServiceService} from 'src/app/db-service.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  nombre: string;
  pass: string;


  constructor(private router: Router, private dBservice: DbServiceService) { }

  ngOnInit() {
    console.log("LOGIN");
  }


  Autentificar () {
    this.dBservice.loginAlumno(this.nombre, this.pass)
    .subscribe (persona => {

      if (persona.length != 0){

        
        console.log("si");
        console.log(persona);
        //localStorage.setItem.(id)
        this.router.navigate(['/menu-principal']);

      }
      else console.log("no");



                             /* if (persona != null) {
                                if (persona.rol === 'Profesor') {
                                    window.location.href = '/profesor';
                                } else {
                                    window.location.href = '/alumno/' + persona.nombre;
                                }
                              }*/

                            }
                );

  }





}