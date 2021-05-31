import { Component, OnInit } from '@angular/core';
import{DbServiceService} from 'src/app/db-service.service'
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  nombre: string;
  pass: string;


  constructor(private router: Router, private dBservice: DbServiceService, public alertController: AlertController) { }

  ngOnInit() {
    console.log("LOGIN");
  }


  Autentificar () {
    this.dBservice.loginAlumno(this.nombre, this.pass)
    .subscribe ( persona => {

      if (persona.length != 0){

        
        console.log("si");
        console.log(persona);
        localStorage.setItem("alumnoID", persona[0].id)
        this.router.navigate(['/menu-principal']);

      }
      else {
        this.alertaCuentoYaCreado()
        console.log("no");
      }


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

  async alertaCuentoYaCreado() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Contraseña incorrecta',
      message: 'Contraseña incorrecta',
      buttons: ['Aceptar']
    });

    await alert.present();
  }





}
