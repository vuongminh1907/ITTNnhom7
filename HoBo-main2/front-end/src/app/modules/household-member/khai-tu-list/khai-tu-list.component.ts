import { KhaiTuInfoComponent } from './../khai-tu-info/khai-tu-info.component';
import { KhaiTuService } from './../../../services/khai-tu.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmPopupComponent } from '../../confirm-popup/confirm-popup.component';
import { KhaiTuAddComponent } from '../khai-tu-add/khai-tu-add.component';

@Component({
  selector: 'app-khai-tu-list',
  templateUrl: './khai-tu-list.component.html',
  styleUrls: ['./khai-tu-list.component.scss']
})
export class KhaiTuListComponent implements OnInit {
  data = [];
  dataSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns = ['checkbox', 'so_giay_khai_tu', 'ten_nguoi_chet', 'ngay_khai', 'ngay_chet', 'ly_do_chet', 'action'];
  checkedList: any[] = [];

  constructor(public dialog: MatDialog,
    private toastrService: ToastrService,
    private khaiTuService: KhaiTuService) {
  }

  ngOnInit(): void {
    this.search();
  }

  ngAfterViewInit() {

  }

  search() {
    this.khaiTuService.getAllKhaiTus().subscribe(
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
    const dialogRef = this.dialog.open(KhaiTuAddComponent, {
      width: '680px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.search();
    });
  }

  onEdit(id: any) {
    // this.router.navigate(['home/household-member/edit/', id]);
  }

  onDelete(idList: any) {
    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      data: {
        title: `Bạn có muốn xoá ${idList.length} khai tử này không?`,
        text: 'Dữ liệu sẽ được xoá và không khôi phục được',
      },
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let params = {id_list: idList}
        this.khaiTuService.deleteKhaiTu(params).subscribe(
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

  changeChecked(user_id: any) {
    if (this.checkedList.includes(user_id)) {
      this.checkedList = this.checkedList.filter(x => x !== user_id);
    }
    else this.checkedList.push(user_id);
  }

  onOpen(id: any) {
    this.khaiTuService.getKhaiTuById(id).subscribe(
      (res) => {
        const dialogRef = this.dialog.open(KhaiTuInfoComponent, {
          data: res.data,
          width: '680px',
          // height: '80vh',
        })
      })
  }

  onKhaiTu(id: any) {

  }

  onTamVang(id: any) {

  }
}
