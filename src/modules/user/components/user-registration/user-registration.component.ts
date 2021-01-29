import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Bad, Ok } from 'src/modules/common/Result';
import { LocalUserQueries } from '../../services/platform/local/user.queries.local';
import { UserQueries } from '../../services/user.queries';
import { UserService } from '../../services/user.service';

class UserRegistrationFormModel {
  username = "";
  password = "";
  confirmPassword = "";
}

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.less']
})
export class UserRegistrationComponent implements OnInit {
  @Input() public validation_error: string;
  registrationForm!: FormGroup

  model = new UserRegistrationFormModel();

  constructor(
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private userQueries: UserQueries
  ) {};

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    })
  }

  async submit() {
    console.log(this.registrationForm.get("username")!.value)
    for (const i in this.registrationForm.controls) {
      this.registrationForm.controls[i].markAsDirty();
      this.registrationForm.controls[i].updateValueAndValidity();
    }
    if (this.registrationForm.invalid || this.registrationForm.get("password")!.value !== this.registrationForm.get("confirmPassword")!.value) {
      this.registrationForm.controls.password.setErrors({different:true})
    }
    else if(await this.userQueries.exists(this.registrationForm.get("username")!.value)) {
      this.registrationForm.controls.username.setErrors({duplicated:true})
    }
    else {
      await this.register()
      this.goToLogin()
    }
  }

  async register(): Promise<Bad<"cant_register"> | Ok>{
    if (!this.registrationForm.valid) {
      return Bad("cant_register");
    }

    try {
      const rep = await this.userService.register(
        this.registrationForm.get("username")!.value,
        this.registrationForm.get("password")!.value
      )
      return Ok()
    } catch(e) {
      return Bad("cant_register")
    }
  }

  goToLogin() {
    this.router.navigate(['/splash/login']);
  }
}
