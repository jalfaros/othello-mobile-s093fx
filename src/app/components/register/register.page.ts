import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthServiceService } from '../../services/auth-service.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {


  registForm: FormGroup

  constructor(private formBuilder: FormBuilder,
    private fireAuth: AuthServiceService,
    private toast: ToastController,
    private router: Router) { }

  ngOnInit() {
    this.generateForm();
  }

  get invalidEmail() {
    return this.registForm.get('email').invalid && this.registForm.get('email').touched
  }

  get invalidUserName() {
    return this.registForm.get('userName').invalid && this.registForm.get('userName').touched
  }

  get invalidPassword() {
    return this.registForm.get('password').invalid && this.registForm.get('password').touched
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


    this.registForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      userName: ['', [Validators.required, Validators.minLength(2)]]
    })
  }

  saveUserInformation(response) {

    localStorage.setItem('user', JSON.stringify({
      uid: response.uid,
      displayName: response.displayName,
      email: response.email
    }));

    this.informationToast(`Bienvenido: ${response.displayName}`, 'success');

  }


  onSubmit() {

    if (this.registForm.invalid) {
      Object.values(this.registForm.controls)
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
    this.firebaseNewUser(this.registForm.value);

  }

  async firebaseNewUser(form) {

    try {
      const user = await this.fireAuth.createUser(form).then();
      console.log(user);
      this.informationToast('Registrado con éxito!', 'success');
      this.goLogin();

    } catch (error) {
      this.informationToast(error.message, 'danger');
    }

  }



  goLogin() {
    this.router.navigate(['/login']);
  }

}