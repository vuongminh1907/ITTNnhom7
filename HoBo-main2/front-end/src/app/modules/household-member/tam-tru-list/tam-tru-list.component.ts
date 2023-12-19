import { TamTruInfoComponent } from './../tam-tru-info/tam-tru-info.component';
import { TamTruAddComponent } from './../tam-tru-add/tam-tru-add.component';
import { TamTruService } from './../../../services/tam-tru.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmPopupComponent } from '../../confirm-popup/confirm-popup.component';

@Component({
  selector: 'app-tam-tru-list',
  templateUrl: './tam-tru-list.component.html',
  styleUrls: ['./tam-tru-list.component.scss']
})
export class TamTruListComponent implements OnInit {
  data = [];
  dataSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns = ['checkbox', 'ma_giay_tam_tru', 'ten_nhan_khau', 'tu_ngay', 'den_ngay', 'action'];
  checkedList: any[] = [];

  constructor(public dialog: MatDialog,
    private toastrService: ToastrService,
    private tamTruService: TamTruService) {
  }

  ngOnInit(): void {
    this.search();
  }

  ngAfterViewInit() {

  }

  search() {
    this.tamTruService.getAllTamTrus().subscribe(
      (res: any) => {
        this.data = res.data;
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
    const dialogRef = this.dialog.open(TamTruAddComponent, {
      width: '680px',
      maxHeight: '80vh',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      this.search();
    })
    // this.router.navigate(['home/household-member/add']);
  }

  onEdit(id: any) {
    // this.router.navigate(['home/household-member/edit/', id]);
  }

  onDelete(idList: any) {
    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      data: {
        title: `Bạn có muốn xoá ${idList.length} tạm trú này không?`,
        text: 'Dữ liệu sẽ được xoá và không khôi phục được',
      },
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let params = {id_list: idList}
        this.tamTruService.deleteTamTrus(params).subscribe(
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
    this.tamTruService.getTamTruById(id).subscribe(
      (res: any) => {
        const dialogRef = this.dialog.open(TamTruInfoComponent, {
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
