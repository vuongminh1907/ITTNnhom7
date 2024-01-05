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
import { BatBuocInfoComponent } from '../bat-buoc-info/bat-buoc-info.component';
import { BatBuocAddMoneyComponent } from '../bat-buoc-add-money/bat-buoc-add-money.component';
import { DanhSachDongGopService } from '../../../services/danh-sach-dong-gop.service';
import { BatBuocDienNuocComponent } from '../bat-buoc-dien-nuoc/bat-buoc-dien-nuoc.component';
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
  //search.month = this.searchmonth;
  displayedColumns = ['ma_ho_khau', 'ten_chu_ho', 'so_tien_con_thieu', 'so_tien','nop_ngay', 'action'];
  // checkedList: any[] = [];

  constructor(public dialog: MatDialog,
    private toastrService: ToastrService,
    private batbuocService: BatBuocService,
    private danhsachDongDop: DanhSachDongGopService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.getAllDanhSach();
  }
  getAllDanhSach() {
    this.batbuocService.getAllBatBuoc().subscribe(
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

  ngAfterViewInit() {

  }


  //Them phi bat buoc
  onAdd() {
    const dialogRef = this.dialog.open(BatBuocAddComponent, {
      width: '630px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    })
    
  }
  

  querySearchMonthYear() {
    let params = {
      nam: this.searchYear,
      thang: this.searchMonth,
    };
    this.batbuocService.searchMonthYear(params).subscribe(
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

  

  onOpenInfo(ma_ho_khau: any) {
    // this.batbuocService.getBatBuocById(ma_ho_khau, this.searchMonth, this.searchYear).subscribe(
    //   (res) => {
    //     console.log('Data received:', res.data);
  
    //     // Kiểm tra xem data có giá trị không
    //     if (res.data) {
    //       const dialogRef = this.dialog.open(BatBuocInfoComponent, {
    //         data: res.data,
    //         width: '680px',
    //         // height: '80vh',
    //       });
    //     } else {
    //       console.error('Empty data received');
    //       // Xử lý trường hợp dữ liệu rỗng nếu cần thiết
    //     }
    //   },
    //   (error) => {
    //     console.error('Error fetching data:', error);
    //   }
    // );
    const dialogRef = this.dialog.open(BatBuocInfoComponent, {
      width: '680px',
      // maxHeight: '80vh',
      disableClose: true,
      data: { ma_ho_khau: ma_ho_khau , thang : this.searchMonth, nam : this.searchYear }
    });
  }


  onAddMoney(ma_ho_khau: any) {
    const dialogRef = this.dialog.open(BatBuocAddMoneyComponent, {
      width: '680px',
      // maxHeight: '80vh',
      disableClose: true,
      data: { ma_ho_khau: ma_ho_khau , thang : this.searchMonth, nam : this.searchYear }
    });
    // dialogRef.afterClosed().subscribe(() => {
    //   this.search();
    // })
  }

  onDienNuoc() {
    const dialogRef = this.dialog.open(BatBuocDienNuocComponent, {
      width: '400px',
      // maxHeight: '80vh',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getAllDanhSach();
    })
  }
 
 


  
  // cancelSearch() {
  //   this.typeSearch = 'none';
  //   this.searchStr = '';
  //   this.searchHouseholdMembers();
  // }
}
