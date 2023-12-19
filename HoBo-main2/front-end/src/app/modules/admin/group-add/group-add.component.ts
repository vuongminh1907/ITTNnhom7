import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UserGroupService } from 'src/app/services/user-group.service';
import { UserService } from 'src/app/services/user.service';
import { ConfirmPopupComponent } from '../../confirm-popup/confirm-popup.component';

@Component({
  selector: 'app-group-add',
  templateUrl: './group-add.component.html',
  styleUrls: ['./group-add.component.scss']
})
export class GroupAddComponent implements OnInit {
  userGroupForm!: FormGroup;
  allRole: any[] = [];
  allUser: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<GroupAddComponent>,
    private userGroupService: UserGroupService,
    private userService: UserService,
    public dialog: MatDialog,
    private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.getRoleList();
    this.getUserList();
    this.initForm();
  }

  initForm() {
    this.userGroupForm = new FormGroup({
      ten_nhom: new FormControl('', Validators.required),
      mo_ta: new FormControl(''),
      list_chuc_nang: new FormControl([], Validators.required),
      list_nguoi_dung: new FormControl([])
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
    this.userGroupService.createGroup(params).subscribe(
      (res) => {
        this.toastrService.success(res.message);
      }, (error) => {
        this.toastrService.error(error.error.message);
      }
    )
  }
}
