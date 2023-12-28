import { Route, Router } from '@angular/router';
//import { HouseholdAddComponent } from './../household-add/household-add.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { DanhSachDongGopService } from '../../../services/danh-sach-dong-gop.service';
import { HouseholdDonateAddComponent } from '../household-donate-add/household-donate-add.component';
import { HouseholdDonateInfoComponent } from '../household-donate-info/household-donate-info.component';
import { HouseholdDonateDeleteComponent } from '../household-donate-delete/household-donate-delete.component'
@Component({
  selector: 'app-household-donate-list',
  templateUrl: './household-donate-list.component.html',
  styleUrls: ['./household-donate-list.component.scss']
})
export class HouseholdDonateListComponent implements OnInit {

  data: any;
  dataSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns = ['ma_ho_khau', 'ten_chu_ho', 'so_tien', 'action'];
  checkedList: any[] = [];

  constructor(public dialog: MatDialog,
    private toastrService: ToastrService,
    private danhsachDongGopService: DanhSachDongGopService,
    private route: Router) {
  }

  ngOnInit(): void {
    this.search();
  }

  ngAfterViewInit() {

  }

  // de lay cac list household
  search() {
    this.danhsachDongGopService.getAllHoDongGops().subscribe(
      (res) => {
        console.log(res); // Log dữ liệu từ API
        this.data = res.data || [];
        this.dataSource = new MatTableDataSource<any>(this.data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

      },
      (error) => {
        console.log(error);
      }
    );
  }


  // household-info
  openInfo(id: any) {
    this.danhsachDongGopService.getHoDongGopById(id).subscribe(
      (res: any) => {
        //let household = res.data;
        console.log(res.data)
        const dialogRef = this.dialog.open(HouseholdDonateInfoComponent, {
          data: res.data,
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

  // Add
  onAdd(id: any) {
    const dialogRef = this.dialog.open(HouseholdDonateAddComponent, {
      width: '680px',
      // maxHeight: '80vh',
      disableClose: true,
      data: { selectedHoKhauId: id }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.search();
    })
  }


  //delete  
  onDelete(id: any) {
    const dialogRef = this.dialog.open(HouseholdDonateDeleteComponent, {
      width: '680px',
      // maxHeight: '80vh',
      disableClose: true,
      data: { selectedHoKhauId: id }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.search();
    })
  }
}
