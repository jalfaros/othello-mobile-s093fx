import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthServiceService } from '../../services/auth-service.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GameCreaterService } from '../../services/game-creater.service';


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
    private router: Router,
    private service: GameCreaterService) { }

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



  generateForm() {


    this.registForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      userName: ['', [Validators.required, Validators.minLength(2)]]
    })
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

  firebaseNewUser(form) {

    this.fireAuth.createUser(form);
  }

}