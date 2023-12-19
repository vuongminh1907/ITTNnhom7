import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { UserGroupService } from 'src/app/services/user-group.service';
import { ConfirmPopupComponent } from './../confirm-popup/confirm-popup.component';
import { Component, Inject, OnInit } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {

  readonly dinhDangMatKhau = /^(?=.*[a-z]+)(?=.*[A-Z]+)^(?=.*[!@#$%^&*]+)[a-zA-Z0-9!@#$%^&*]{6,32}$/;
  readonly dinhDangHoTen = /^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\ ]+$/
  readonly dinhDangSdt = /^[0-9]{9,11}$/;
  readonly dinhDangEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  userInfoForm!: FormGroup;
  userInfo: any;

  isEditing = false;

  nhomList: any[] = [];

  constructor(public dialogRef: MatDialogRef<UserInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private userGroupService: UserGroupService,
    private userService: UserService,
    private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.initForm();
    this.getGroups();
  }

  initForm() {
    let idNhomList: any[] = [];
    this.data.nhom.forEach((nhom: any) => { idNhomList.push(nhom.id_nhom) })

    this.userInfoForm = new FormGroup({
      ten_dang_nhap: new FormControl({ value: this.data.ten_dang_nhap, disabled: true }),
      ten_day_du: new FormControl({ value: this.data.ten_day_du, disabled: !this.isEditing }, Validators.compose([
        Validators.required,
        Validators.pattern(this.dinhDangHoTen)
      ])),
      email: new FormControl(
        {
          value: !!this.data.email ? this.data.email : '',
          disabled: !this.isEditing
        },
        Validators.pattern(this.dinhDangEmail)),
      so_dien_thoai: new FormControl(
        {
          value: !!this.data.so_dien_thoai ? this.data.so_dien_thoai : '',
          disabled: !this.isEditing
        },
        Validators.pattern(this.dinhDangSdt)),
      // avatar_url: new FormControl(
      //   {
      //     value: !!this.data.avatar_url ? this.data.avatar_url : '',
      //     disable: !this.isEditing
      //   }),
      chuc_vu: new FormControl({ value: this.data.chuc_vu, disabled: !this.isEditing }),
      nhom: new FormControl({ value: idNhomList, disabled: !this.isEditing })
    })
  }

  getGroups() {
    this.userGroupService.getAllGroups().subscribe(
      (res) => {
        this.nhomList = res.data;
      }
    )
  }

  onEdit() {
    this.isEditing = true;
    this.userInfoForm.enable();
    this.userInfoForm.get('ten_dang_nhap')?.disable();
  }

  closePopup() {
    console.log(this.userInfoForm.dirty, this.userInfoForm.valid)
    if (this.userInfoForm.valid && this.userInfoForm.dirty) {
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

  onSave() {
    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      data: {
        title: 'Bạn có muốn lưu không?',
        text: 'Thông tin đang thay đổi sẽ được lưu vào cơ sở dữ liệu'
      },
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let params = this.userInfoForm.value;
        this.userService.updateUser(this.data.id_nguoi_dung, params).subscribe(
          (res) => {
            // console.log(res, 'aaa');
            this.toastrService.success(res.message);
            this.dialogRef.close();
          },
          (error) => {
            this.toastrService.error(error.error.message);
            // console.log(error, 'mmmm')
          }
        )
      }
    });
  }
}
