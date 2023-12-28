import { TamVangService } from '../../../services/tam-vang.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'; 
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { DongGopService } from 'src/app/services/dong-gop.service';
import { ConfirmPopupComponent } from '../../confirm-popup/confirm-popup.component';
import { DongGopAddComponent } from '../dong-gop-add/dong-gop-add.component';
import { DongGopInfoComponent } from '../dong-gop-info/dong-gop-info.component';
@Component({
  selector: 'app-dong-gop-list',
  templateUrl: './dong-gop-list.component.html',
  styleUrls: ['./dong-gop-list.component.scss']
})
export class DongGopListComponent implements OnInit {

  data = [];
  dataSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns = ['checkbox', 'ma_dong_gop', 'ten_dong_gop', 'so_tien', 'han_nop', 'action'];
  checkedList: any[] = [];

  constructor(
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private dongGopService: DongGopService) {
  }

  ngOnInit(): void {
    this.search();
    console.log(this.data);
  }

  ngAfterViewInit() {

  }

  search() {
    this.dongGopService.getAllDongGops().subscribe(
      (res: any) => {
        this.data = res.data;
        console.log('aaaa', res.data)
        this.dataSource = new MatTableDataSource<any>(this.data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  onAdd() {
    const dialogRef = this.dialog.open(DongGopAddComponent, {
      width: '680px',
      // maxHeight: '80vh',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      this.search();
    })
  }

  onEdit(id: any) {
    // this.router.navigate(['home/household-member/edit/', id]);
  }

  onDelete(idList: any) {
    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      data: {
        title: `Bạn có muốn xoá ${idList.length} đóng góp này không?`,
        text: 'Dữ liệu sẽ được xoá và không khôi phục được',
      },
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let params = {id_list: idList}
        this.dongGopService.deleteDongGops(params).subscribe(
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

  // onOpen(id: any) {
  //   this.dongGopService.getDongGopById(id).subscribe(
  //     (res: any) => {
  //       const dialogRef = this.dialog.open(DongGopInfoComponent, {
  //         data: res.data,
  //         width: '680px',
  //         // height: '80vh',
  //       })
  //     })
  // }
  openDetailDialog(id: any): void {
    this.dongGopService.getDongGopById(id).subscribe(
      (res: any) => {
        console.log(res); // Ghi log phản hồi để kiểm tra xem dữ liệu có được nhận không
        const dialogRef = this.dialog.open(DongGopInfoComponent, {
          data: res.data,
          width: '680px',
          // height: '80vh',
        });
      }
    );
  }
}
