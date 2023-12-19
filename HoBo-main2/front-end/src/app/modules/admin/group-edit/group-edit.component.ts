import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { UserGroupService } from 'src/app/services/user-group.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { ConfirmPopupComponent } from '../../confirm-popup/confirm-popup.component';

@Component({
  selector: 'app-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.scss']
})
export class GroupEditComponent implements OnInit {
  userGroupForm!: FormGroup
  allRole: any[] = [];
  allUser: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<GroupEditComponent>,
    private userGroupService: UserGroupService,
    private userService: UserService,
    public dialog: MatDialog,
    private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.getRoleList();
    this.getUserList();
    this.initForm();
    console.log(this.userGroupForm.value);
  }

  initForm() {
    let idRoleList: any[] = [];
    this.data.role_list.forEach((role: any) => { idRoleList.push(role.id_chuc_nang) })

    let idUserList: any[] = [];
    this.data.user_list.forEach((user: any) => { idUserList.push(user.id_nguoi_dung) })

    this.userGroupForm = new FormGroup({
      ten_nhom: new FormControl(this.data.ten_nhom, Validators.required),
      mo_ta: new FormControl(this.data.mo_ta),
      list_chuc_nang: new FormControl(idRoleList, Validators.required),
      list_nguoi_dung: new FormControl(idUserList)
    })
  }

  getRoleList() {
    this.userGroupService.getRoles().subscribe(
      (res) => {
        this.allRole = res.data;
      },
      (error) => console.log(error)
    )
  }
  getUserList() {
    this.userService.getAllUsers().subscribe(
      (res) => {
        this.allUser = res.data;
      },
      (error) => console.log(error)
    )
  }

  closePopup() {
    console.log(this.userGroupForm.dirty, this.userGroupForm.valid)
    if (this.userGroupForm.valid && this.userGroupForm.dirty) {
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
          this.dialogRef.close();
        }
      });
    }
    else this.dialogRef.close()
  }

  onSaveBtn() {
    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      data: {
        title: 'Bạn có muốn lưu không?',
        text: 'Thông tin sẽ được lưu vào cơ sở dữ liệu'
      },
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveGroup();
        this.dialogRef.close();
      }
    })
  }

  saveGroup() {
    const params = this.userGroupForm.getRawValue();
    this.userGroupService.updateGroup(this.data.id_nhom, params).subscribe(
      (res) => {
        this.toastrService.success(res.message);
      }, (error) => {
        this.toastrService.error(error.error.message);
      }
    )
  }
}
