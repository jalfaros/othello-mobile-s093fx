import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthServiceService } from 'src/app/services/auth-service.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})


export class LoginPage implements OnInit {

  loginForm: FormGroup

  constructor(private formBuilder: FormBuilder,
              private fireAuth: AuthServiceService) { }

  ngOnInit() {
    this.generateForm();
  }

  get invalidEmail() {
    return this.loginForm.get('email').invalid && this.loginForm.get('email').touched
  }

  get invalidPassword() {
    return this.loginForm.get('password').invalid && this.loginForm.get('password').touched
  }

  generateForm() {


    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }


  onSubmit() {

    if ( this.loginForm.invalid ){
      Object.values( this.loginForm.controls )
      .forEach( iterator => {

        if ( iterator instanceof FormGroup ){

          Object.values( iterator.controls ).forEach( campo =>{
            campo.markAllAsTouched();
          })

        } else{
          iterator.markAllAsTouched();
        }

      });
     
      return;
    }
    this.fireAuth.localSignIn( this.loginForm.value );
  }

}
