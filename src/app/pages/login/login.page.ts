import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { RegistroserviceService, Usuario } from '../../services/registroservice.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formularioLogin: FormGroup;
  usuarios: Usuario[] = [];

  constructor(private menuController: MenuController,
    private alertController: AlertController,
    private navController: NavController,
    private registroService: RegistroserviceService,
    private fb: FormBuilder) {
    this.formularioLogin = this.fb.group({
      'correo': new FormControl("", Validators.required),
      'password': new FormControl("", Validators.required),
    })
  }

  ngOnInit() {
  }
  mostrarMenu() {
    this.menuController.open('first');
  }

  async Ingresar() {
    var f = this.formularioLogin.value;


    this.registroService.getUsuarios().then(datos => {
      this.usuarios = datos;
      if (datos.length == 0) {
        return;
      }

      const encontrado = this.usuarios.find(usuario => usuario.correoUsuario == f.correo);

      if (!encontrado) {
        this.mostrarMensajeError();
        return
      }

      if (encontrado.passUsuario == f.password) {

        localStorage.setItem('ingresado', 'true');
        localStorage.setItem('nomUsuario', encontrado.nomUsuario);
        this.mostrarMensajeExito();
        
        

      }if (encontrado.esDocente == true){
        localStorage.setItem('esDocente', 'true')
        this.navController.navigateRoot('generar-qr');
        
      } if (encontrado.esDocente == false){
        localStorage.setItem('esDocente', 'false')  
        this.navController.navigateRoot('inicio');    

      }if (encontrado.passUsuario != f.password){
        this.alertMsg();
      }


    });
  }

  async mostrarMensajeExito() {
    const alert = await this.alertController.create({
      header: '¡Bienvenid@ ' + localStorage.getItem("nomUsuario") + '!',
      message: '¡Ingreso exitoso!',
      buttons: ['Aceptar']
    });
    await alert.present();
    
  
  }


  async mostrarMensajeError() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'El usuario no existe. Por favor, verifique sus credenciales.',
      buttons: ['Aceptar']
    });
    await alert.present();
  }

  async alertMsg() {
    const alert = await this.alertController.create({
      header: '¡Error!',
      message: 'Los datos ingresados no son correctos, por favor verifique sus credenciales',
      buttons: ['Aceptar'],
    });
    await alert.present();
    return;
  }



}
