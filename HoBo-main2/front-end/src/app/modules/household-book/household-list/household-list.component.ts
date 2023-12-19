import { Route, Router } from '@angular/router';
import { HouseholdAddComponent } from './../household-add/household-add.component';
import { HouseholdInfoComponent } from './../household-info/household-info.component';
import { HouseholdBookService } from './../../../services/household-book.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { UserGroupService } from 'src/app/services/user-group.service';
import { UserService } from 'src/app/services/user.service';
import { GroupInfoComponent } from '../../admin/group-info/group-info.component';
import { ConfirmPopupComponent } from '../../confirm-popup/confirm-popup.component';
import { SignupComponent } from '../../signup/signup.component';
import { UserInfoComponent } from '../../user-info/user-info.component';

@Component({
  selector: 'app-household-list',
  templateUrl: './household-list.component.html',
  styleUrls: ['./household-list.component.scss']
})
export class HouseholdListComponent implements OnInit {

  data: any;
  dataSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns = ['checkbox', 'ma_ho_khau', 'ten_chu_ho', 'ma_khu_vuc', 'dia_chi', 'ngay_lap', 'action'];
  checkedList: any[] = [];

  constructor(public dialog: MatDialog,
    private toastrService: ToastrService,
    private householdBookService: HouseholdBookService,
    private route: Router) {
  }

  ngOnInit(): void {
    this.search();
  }

  ngAfterViewInit() {

  }

  search() {
    this.householdBookService.getAllHouseholds().subscribe(
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



  onAddHousehold() {
    this.route.navigate(['./home/household-book/add']);
    // const dialogRef = this.dialog.open(HouseholdAddComponent, {
    //   width: '680px',
    //   disableClose: true
    // });
    // dialogRef.afterClosed().subscribe(() => {
    //   this.search();
    // })
  }

  onDelete(idList: any) {
    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      data: {
        title: `Bạn có muốn xoá ${idList.length} hộ khẩu này không?`,
        text: 'Dữ liệu sẽ được xoá và không khôi phục được',
      },
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let params = {id_list: idList}
        this.householdBookService.deleteHousehold(params).subscribe(
          (res) => {
            this.toastrService.success(res.message);
            this.search();
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

  openInfo(id: any) {
    this.householdBookService.getHouseholdById(id).subscribe(
      (res: any) => {
        let household = res.data;
        console.log(res.data)
        const dialogRef = this.dialog.open(HouseholdInfoComponent, {
          data: household,
          width: '680px'
        });

        dialogRef.afterClosed().subscribe(() => {
          this.search();
        })
      });
  }

  changeChecked(user_id: any) {
    if (this.checkedList.includes(user_id)) {
      this.checkedList = this.checkedList.filter(x => x !== user_id);
    }
    else this.checkedList.push(user_id);
  }

  onEdit(id: any) {
    this.route.navigate(['home/household-book/edit/', id]);
  }

  onSplit(id: any) {
    this.route.navigate(['home/household-book/split/', id]);
  }
}
