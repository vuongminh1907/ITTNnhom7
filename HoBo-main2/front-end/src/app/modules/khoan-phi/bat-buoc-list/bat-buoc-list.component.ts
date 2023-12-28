import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { BatBuocService } from 'src/app/services/bat-buoc.service';
import { ConfirmPopupComponent } from '../../confirm-popup/confirm-popup.component';
import { MatSelect } from '@angular/material/select'; 
import { BatBuocAddComponent } from '../bat-buoc-add/bat-buoc-add.component';

@Component({
  selector: 'app-bat-buoc-list',
  templateUrl: './bat-buoc-list.component.html',
  styleUrls: ['./bat-buoc-list.component.scss']
})
export class BatBuocListComponent implements OnInit {
  data = [];
  dataSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  searchStr = '';
  searchMonth: any;
  searchYear: any;
  search : any;
  //search.month = this.searchmonth;
  displayedColumns = ['ma_ho_khau', 'ten_chu_ho', 'so_tien_thieu', 'so_tien_da_nop', 'action'];
  // checkedList: any[] = [];

  constructor(public dialog: MatDialog,
    private toastrService: ToastrService,
    private batbuocService: BatBuocService,
    private router: Router) {
  }

  ngOnInit(): void {
   // this.searchHouseholdMembers();
  }

  ngAfterViewInit() {

  }

  searchHouseholdMembers(searchMonth: any,searchYear: any) {
    this.batbuocService.searchBatBuoc(searchMonth).subscribe(
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



  //Them phi bat buoc
  onAdd() {
    const dialogRef = this.dialog.open(BatBuocAddComponent, {
      width: '680px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    })
    
  }

  // onEdit(id: any) {
  //   this.router.navigate(['home/household-member/edit/', id]);
  // }

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

  // onOpen(id: any) {
  //   this.householdMemberService.getHouseholdMember(id).subscribe(
  //     (res) => {
  //       const dialogRef = this.dialog.open(HouseholdMemberInfoComponent, {
  //         data: res.data,
  //         width: '680px',
  //         // height: '80vh',
  //       })
  //     })
  // }


  queryHouseholdMembers() {
    this.batbuocService.searchBatBuoc(this.searchStr).subscribe(
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

  // cancelSearch() {
  //   this.typeSearch = 'none';
  //   this.searchStr = '';
  //   this.searchHouseholdMembers();
  // }
}
