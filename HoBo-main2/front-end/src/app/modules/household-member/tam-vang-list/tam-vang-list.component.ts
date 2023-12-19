import { TamVangService } from './../../../services/tam-vang.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { TamTruService } from 'src/app/services/tam-tru.service';
import { ConfirmPopupComponent } from '../../confirm-popup/confirm-popup.component';
import { TamTruAddComponent } from '../tam-tru-add/tam-tru-add.component';
import { TamTruInfoComponent } from '../tam-tru-info/tam-tru-info.component';
import { TamVangAddComponent } from '../tam-vang-add/tam-vang-add.component';
import { TamVangInfoComponent } from '../tam-vang-info/tam-vang-info.component';

@Component({
  selector: 'app-tam-vang-list',
  templateUrl: './tam-vang-list.component.html',
  styleUrls: ['./tam-vang-list.component.scss']
})
export class TamVangListComponent implements OnInit {

  data = [];
  dataSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns = ['checkbox', 'ma_giay_tam_vang', 'ten_nhan_khau', 'tu_ngay', 'den_ngay', 'action'];
  checkedList: any[] = [];

  constructor(public dialog: MatDialog,
    private toastrService: ToastrService,
    private tamVangService: TamVangService) {
  }

  ngOnInit(): void {
    this.search();
  }

  ngAfterViewInit() {

  }

  search() {
    this.tamVangService.getAllTamVangs().subscribe(
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
    const dialogRef = this.dialog.open(TamVangAddComponent, {
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
        title: `Bạn có muốn xoá ${idList.length} tạm vắng này không?`,
        text: 'Dữ liệu sẽ được xoá và không khôi phục được',
      },
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let params = {id_list: idList}
        this.tamVangService.deleteTamVangs(params).subscribe(
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
    this.tamVangService.getTamVangById(id).subscribe(
      (res: any) => {
        const dialogRef = this.dialog.open(TamVangInfoComponent, {
          data: res.data,
          width: '680px',
          // height: '80vh',
        })
      })
  }
}
