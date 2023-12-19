import { ConfirmPopupComponent } from './../confirm-popup/confirm-popup.component';
import { ToastrService } from 'ngx-toastr';
import { UserService } from './../../services/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserGroupService } from 'src/app/services/user-group.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  readonly dinhDangMatKhau = /^(?=.*[a-z]+)(?=.*[A-Z]+)^(?=.*[!@#$%^&*]+)[a-zA-Z0-9!@#$%^&*]{6,32}$/;
  readonly dinhDangHoTen = /^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\ ]+$/;
  readonly dinhDangSdt = /^[0-9]{9,11}$/;
  readonly dinhDangEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  readonly dinhDangTdn = /^[\S]+$/;

  signupForm!: FormGroup;
  nhomList: any[] = [];

  constructor(public dialogRef: MatDialogRef<SignupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private toastrService: ToastrService,
    public dialog: MatDialog,
    private userGroupService: UserGroupService) { }

  ngOnInit(): void {
    this.userGroupService.getAllGroups().subscribe(
      (res) => {
        this.nhomList = res.data;
      }
    )
    this.initSignupForm();
  }

  initSignupForm() {
    this.signupForm = new FormGroup({
      tenDangNhap: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(this.dinhDangTdn),
      ])),
      matKhau: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(this.dinhDangMatKhau),
        Validators.minLength(8)
      ])),
      nhapLaiMk: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(this.dinhDangMatKhau),
        Validators.minLength(8)
      ])),
      hoTen: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(this.dinhDangHoTen)
      ])),
      email: new FormControl('', Validators.pattern(this.dinhDangEmail)),
      sdt: new FormControl('', Validators.pattern(this.dinhDangSdt)),
      chucVu: new FormControl('', Validators.pattern(this.dinhDangHoTen)),
      nhom: new FormControl([])
    })
  }

  onAddButton() {
    if (this.signupForm.controls['matKhau'].value !== this.signupForm.controls['nhapLaiMk'].value) {
      this.toastrService.error('Xác nhận sai mật khẩu')
    }
    else {
      const dialogRef = this.dialog.open(ConfirmPopupComponent, {
        data: {
          title: 'Bạn có muốn lưu không?',
          text: 'Thông tin sẽ được lưu vào cơ sở dữ liệu'
        },
        width: '500px',
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result) this.saveValue();
      })
    }
  }

  closePopup() {
    console.log(this.signupForm.dirty, this.signupForm.valid)
    if (this.signupForm.valid && this.signupForm.dirty) {
      const dialogRef = this.dialog.open(ConfirmPopupComponent, {
        data: {
          title: 'Bạn có muốn thoát không?',
          text: 'Dữ liệu đang thay đổi sẽ không được lưu'
        },
        width: '500px',
        disableClose: true
      });

      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          this.dialogRef.close(true);
          console.log('hello');
        }
      });
    }
    else this.dialogRef.close();
  }

  saveValue() {
    const params = {
      ten_dang_nhap: this.signupForm.controls['tenDangNhap'].value,
      mat_khau: this.signupForm.controls['matKhau'].value,
      ten_day_du: this.signupForm.controls['hoTen'].value,
      email: this.signupForm.controls['email'].value,
      so_dien_thoai: this.signupForm.controls['sdt'].value,
      // avatar_url: this.signupForm.controls['sdt'].value,
      chuc_vu: this.signupForm.controls['chucVu'].value,
      nhom: this.signupForm.controls['nhom'].value,
    }
    this.userService.registerUser(params).subscribe(
      (res) => {
        this.toastrService.success(res.message);
        this.dialogRef.close(true);
      },
      (error: any) => {
        this.toastrService.error(error.error.message);
      }
    )
  }
}
