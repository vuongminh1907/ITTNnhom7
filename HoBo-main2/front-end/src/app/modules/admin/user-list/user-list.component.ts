import { UserGroupService } from 'src/app/services/user-group.service';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { SignupComponent } from '../../signup/signup.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { UserService } from 'src/app/services/user.service';
import { UserInfoComponent } from '../../user-info/user-info.component';
import { ConfirmPopupComponent } from '../../confirm-popup/confirm-popup.component';
import { MatSort } from '@angular/material/sort';
import { GroupInfoComponent } from '../group-info/group-info.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  data: any;
  dataSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns = ['checkbox', 'ten_dang_nhap', 'ten_day_du', 'email', 'so_dien_thoai', 'chuc_vu', 'nhom', 'action'];
  checkedList: any[] = [];

  constructor(public dialog: MatDialog,
    private userService: UserService,
    private toastrService: ToastrService,
    private userGroupService: UserGroupService) {
  }

  ngOnInit(): void {
    this.searchUsers();
  }

  ngAfterViewInit() {

  }

  searchUsers() {
    this.userService.getAllUsers().subscribe(
      (res) => {
        this.data = res.data;
        this.dataSource = new MatTableDataSource<any>(this.data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

      },
      (error) => {
        console.log(error);
      }
    );
  }



  onAddUser() {
    const dialogRef = this.dialog.open(SignupComponent, {
      width: '680px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      this.searchUsers();
    })
  }

  onDelete(idList: any) {
    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      data: {
        title: `Bạn có muốn xoá ${idList.length} người dùng này không?`,
        text: 'Dữ liệu sẽ được xoá và không khôi phục được',
      },
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let params = {id_list: idList}
        this.userService.deleteUsers(params).subscribe(
          (res) => {
            this.toastrService.success(res.message);
            this.searchUsers();
            this.checkedList = [];
          },
          (error) => {
            this.toastrService.error(error.error.message);
            this.checkedList = [];
          }
        )
      }
    });

  }

  openUserInfo(id: any) {
    this.userService.getUserById(id).subscribe(
      (res) => {
        let user = res.data;
        const dialogRef = this.dialog.open(UserInfoComponent, {
          data: user,
        });

        dialogRef.afterClosed().subscribe(() => {
          this.searchUsers();
        })
      });

  }

  changeChecked(user_id: any) {
    if (this.checkedList.includes(user_id)) {
      this.checkedList = this.checkedList.filter(x => x !== user_id);
    }
    else this.checkedList.push(user_id);
  }

  openGroupInfo(id: any) {
    this.userGroupService.getGroupById(id).subscribe(
      (res) => {
        const dialogRef = this.dialog.open(GroupInfoComponent, {
          data: {
            group: res.data,
            mode: 'basic'
          },
          width: '680px',
          maxHeight: '80vh',
        })
      })
  }
}
