import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from "ng-zorro-antd/message";
import { AuthenticationService } from '../../services/authentication.service';

class LoginFormModel {
  username = "";
  password = "";
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  loggingForm!: FormGroup;

  model = new LoginFormModel();

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private nzMessageService: NzMessageService,
    private fb: FormBuilder,

  ) { }

  ngOnInit(): void {
    this.loggingForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    })
  }

  goToRegistration() {
    this.router.navigate(['/splash/register']);
  }

  submit() {
    this.login();
  }

  async login() {
    if (this.loggingForm.invalid) {
      return;
    }

    try {
      const username = this.loggingForm.get("username")!.value
      const pwd = this.loggingForm.get("password")!.value
      const res = await this.authService.authenticate(username, pwd);
      if(res.success) {
        this.router.navigate(['/']);
      } else {
        this.nzMessageService.error("Pas d'utilisateurs avec cette combinaison!");
      }

    } catch (e) {
      this.nzMessageService.error("Une erreur est survenue. Veuillez réessayer plus tard");
    }
  }
}
