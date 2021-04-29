import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})


export class LoginPage implements OnInit {

  loginForm: FormGroup

  constructor(private formBuilder: FormBuilder,
    private fireAuth: AuthServiceService,
    private toast: ToastController,
    private router: Router) { }

  ngOnInit() {
    this.generateForm();
  }

  get invalidEmail() {
    return this.loginForm.get('email').invalid && this.loginForm.get('email').touched
  }

  get invalidPassword() {
    return this.loginForm.get('password').invalid && this.loginForm.get('password').touched
  }

  async informationToast(message, toastType) {
    const toast = await this.toast.create({
      message: message,
      color: toastType,
      animated: true,
      duration: 2000
    });
    toast.present();
  }

  generateForm() {


    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  saveUserInformation(response) {

    localStorage.setItem('user', JSON.stringify({
      uid: response.uid,
      displayName: response.displayName,
      email: response.email
    }));

    this.informationToast(`Bienvenido: ${response.displayName}`, 'dark');
    this.router.navigate(['/lobby']);

  } 


  onSubmit() {

    if (this.loginForm.invalid) {
      Object.values(this.loginForm.controls)
        .forEach(iterator => {

          if (iterator instanceof FormGroup) {

            Object.values(iterator.controls).forEach(campo => {
              campo.markAllAsTouched();
            })

          } else {
            iterator.markAllAsTouched();
          }
        });
      return;
    }
    this.firebaseLogin(this.loginForm.value);
    this.loginForm.reset();
  }

  firebaseLogin(loginForm) {

    this.fireAuth.localSignIn(loginForm).then(response => {
      if (response['message']) {
        this.informationToast(response['message'], 'danger');
      } else {
        this.saveUserInformation(response);
      }
    })
  }

  googleAuth() {
    this.fireAuth.googleSignIn().then(response => {
      if (response['message']) {
        this.informationToast(response['message'], 'danger');
      } else {
        this.saveUserInformation(response);
      }
    });
  }

  goRegist() {
    this.router.navigate(['/register']);
  }

}
