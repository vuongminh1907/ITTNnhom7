import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  readonly dinhDangMatKhau = /^(?=.*[a-z]+)(?=.*[A-Z]+)^(?=.*[!@#$%^&*]+)[a-zA-Z0-9!@#$%^&*]{6,32}$/;
  readonly dinhDangTdn = /^[\S]+$/;

  //Gom chu hoa, chu thuong, so, ki tu dac biet
  loginForm!: FormGroup;

  constructor(private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
    this.initLoginForm();
    // if(localStorage.getItem('user_id')) {
    //   this.router.navigate(['home'])
    // };
  }

  initLoginForm() {
    this.loginForm = new FormGroup({
      tenDangNhap: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(this.dinhDangTdn)
      ])),
      matKhau: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(this.dinhDangMatKhau),
        Validators.minLength(8)
      ])),
      ghiNhoMatKhau: new FormControl()
    });
  }

  onSubmit() {
    const params = {
      ten_dang_nhap: this.loginForm.controls['tenDangNhap'].value,
      mat_khau: this.loginForm.controls['matKhau'].value,
      nho_dang_nhap: !!this.loginForm.controls['ghiNhoMatKhau'].value ? !!this.loginForm.controls['ghiNhoMatKhau'].value : false,
    };

    this.authService.login(params)
      .subscribe(
        (res) => {
          this.toastrService.success(res.message);
          this.router.navigate(['home/statistics']);
          localStorage.setItem('user_id', res.data.id);
          console.log(res.headers.get('Set-Cookie'));
        }, (error) => {
          this.toastrService.error(error.error.message);
          throwError(() => error);
        });
  }
}
