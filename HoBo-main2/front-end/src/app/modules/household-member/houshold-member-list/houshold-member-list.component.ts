import { TamVangAddComponent } from './../tam-vang-add/tam-vang-add.component';
import { KhaiTuAddComponent } from './../khai-tu-add/khai-tu-add.component';
import { Router } from '@angular/router';
import { HouseholdMemberInfoComponent } from './../household-member-info/household-member-info.component';
import { HouseholdMemberAddComponent } from './../household-member-add/household-member-add.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { HouseholdMemberService } from 'src/app/services/household-member.service';
import { ConfirmPopupComponent } from '../../confirm-popup/confirm-popup.component';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-houshold-member-list',
  templateUrl: './houshold-member-list.component.html',
  styleUrls: ['./houshold-member-list.component.scss']
})
export class HousholdMemberListComponent implements OnInit {
  data = [];
  dataSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  typeSearch = 'none';
  searchStr = '';
  displayedColumns = ['ho_ten', 'so_cmt', 'ngay_sinh', 'gioi_tinh', 'dia_chi_hien_nay', 'action'];
  // checkedList: any[] = [];

  constructor(public dialog: MatDialog,
    private toastrService: ToastrService,
    private householdMemberService: HouseholdMemberService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.searchHouseholdMembers();
  }

  ngAfterViewInit() {

  }

  searchHouseholdMembers() {
    this.householdMemberService.getAllHouseholdMember().subscribe(
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



  onAdd() {
    // const dialogRef = this.dialog.open(HouseholdMemberAddComponent, {
    //   width: '680px',
    //   disableClose: true
    // });
    // dialogRef.afterClosed().subscribe(() => {
    //   this.searchHouseholdMembers();
    // })
    this.router.navigate(['home/household-member/add']);
  }

  onEdit(id: any) {
    this.router.navigate(['home/household-member/edit/', id]);
  }

  // onDelete(idList: any) {
  //   const dialogRef = this.dialog.open(ConfirmPopupComponent, {
  //     data: {
  //       title: `Bạn có muốn xoá ${idList.length} nhân khẩu này không?`,
  //       text: 'Dữ liệu sẽ được xoá và không khôi phục được',
  //     },
  //     width: '500px',
  //     disableClose: true
  //   });

  //   // dialogRef.afterClosed().subscribe(result => {
  //   //   if (result) {
  //   //     let params = {id_list: idList}
  //   //     this.householdMemberService.deleteUsers(params).subscribe(
  //   //       (res) => {
  //   //         this.toastrService.success(res.message);
  //   //         this.searchUsers();
  //   //         this.checkedList = [];
  //   //       },
  //   //       (error) => {
  //   //         this.toastrService.error(error.error.message);
  //   //         this.checkedList = [];
  //   //       }
  //   //     )
  //   //   }
  //   // });

  // }

  onOpen(id: any) {
    this.householdMemberService.getHouseholdMember(id).subscribe(
      (res) => {
        const dialogRef = this.dialog.open(HouseholdMemberInfoComponent, {
          data: res.data,
          width: '680px',
          // height: '80vh',
        })
      })
  }

  onKhaiTu(member: any) {
    const dialogRef = this.dialog.open(KhaiTuAddComponent, {
      data: member,
      width: '680px',
      disableClose: true
    });

  }

  onTamVang(member: any) {
    const dialogRef = this.dialog.open(TamVangAddComponent, {
      data: member,
      width: '680px',
      disableClose: true
    });

  }

  queryHouseholdMembers() {
    this.householdMemberService.searchHouseholdMembers(this.typeSearch, this.searchStr).subscribe(
      (res) => {
        this.data = res.data;
        this.dataSource = new MatTableDataSource<any>(this.data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

      },
      (error) => {
        console.log(error);
        this.toastrService.error(error.error.message);
        this.data = [];
        this.dataSource = new MatTableDataSource<any>(this.data);
      }
    )
    return;
  }

  cancelSearch() {
    this.typeSearch = 'none';
    this.searchStr = '';
    this.searchHouseholdMembers();
  }
}
