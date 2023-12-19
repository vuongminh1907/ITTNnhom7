import { ToastrService } from 'ngx-toastr';
import { GroupEditComponent } from './../group-edit/group-edit.component';
import { MatSort } from '@angular/material/sort';
import { GroupInfoComponent } from './../group-info/group-info.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserGroupService } from 'src/app/services/user-group.service';
import { resolveSoa } from 'dns';
import { GroupAddComponent } from '../group-add/group-add.component';
import { ConfirmPopupComponent } from '../../confirm-popup/confirm-popup.component';

@Component({
  selector: 'app-role-group-list',
  templateUrl: './role-group-list.component.html',
  styleUrls: ['./role-group-list.component.scss']
})
export class RoleGroupListComponent implements OnInit {
  data: any
  dataSource: any
  displayedColumns = ['checkbox', 'ten_nhom', 'mo_ta', 'role_list', 'action'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  checkedList: any[] = [];
  chucNangList: any = {}
  constructor(
    public dialog: MatDialog, 
    private userGroupService: UserGroupService, 
    private toastrService: ToastrService) {

  }

  ngOnInit(): void {
    this.searchGroups();
  }

  ngAfterViewInit() {
  }

  searchGroups() {
    this.userGroupService.getAllGroups().subscribe(
      (res) => {
        this.data = res.data;
        this.dataSource = new MatTableDataSource<any>(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.setChucNangList();
      },
      (error) => {
        console.log(error);
      }
    )
  }

  setChucNangList() {
    this.data.forEach((ele: any) => {
      let list: any = [];
      ele.role_list.forEach((chuc_nang: any) => list.push(chuc_nang.ten_chuc_nang))
      this.chucNangList[ele.id_nhom] = list;
    })
    console.log(this.chucNangList);
  }

  onAddGroup() {
    const dialogRef = this.dialog.open(GroupAddComponent, {
      width: '680px',
      maxHeight: '80vh',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      this.searchGroups();
    })
  }

  onDelete(idList: any) {
    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      data: {
        title: `Bạn có muốn xoá ${idList.length} nhóm này không?`,
        text: 'Dữ liệu sẽ được xoá và không khôi phục được',
      },
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let params = {id_list: idList}
        this.userGroupService.deleteGroups(params).subscribe(
          (res) => {
            this.toastrService.success(res.message);
            this.searchGroups();
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

  changeChecked(id: any) {
    if (this.checkedList.includes(id)) {
      this.checkedList = this.checkedList.filter(x => x !== id);
    }
    else this.checkedList.push(id);
  }

  openGroupInfo(id: any) {
    this.userGroupService.getGroupById(id).subscribe(
      (res) => {
        const dialogRef = this.dialog.open(GroupInfoComponent, {
          data: {
            group: res.data,
            mode: 'more'
          },
          width: '680px',
          maxHeight: '80vh',
        })
      })
  }

  editGroup(id: any) {
    this.userGroupService.getGroupById(id).subscribe(
      (res) => {
        const dialogRef = this.dialog.open(GroupEditComponent, {
          data: res.data,
          width: '680px',
          maxHeight: '80vh',
          disableClose: true
        });
        dialogRef.afterClosed().subscribe(() => {
          this.searchGroups()
        })
      })
  }
}
