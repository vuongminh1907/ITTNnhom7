import { Observable } from 'rxjs';
import { Component, Input, EventEmitter, OnInit, Output, ViewChild, AfterViewInit, AfterViewChecked } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { HouseholdMemberService } from 'src/app/services/household-member.service';

@Component({
  selector: 'app-household-book-member',
  templateUrl: './household-book-member.component.html',
  styleUrls: ['./household-book-member.component.scss']
})
export class HouseholdBookMemberComponent implements OnInit {
  search = '';
  @Input() data: any = [];
  @Input() dataSource: any = [];
  @Input() events!: Observable<any>;
  @Input() eventsRight!: Observable<any>;
  @Input() quanHeEvents!: Observable<any>

  validParams = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  list_nhan_khau: any = [];
  dataMap: any = {}

  displayedColumns = ['checkbox', 'ho_ten', 'ngay_sinh', 'gioi_tinh', 'so_cmt'];
  displayedColumnsRight = ['delete', 'ho_ten', 'ngay_sinh', 'gioi_tinh', 'so_cmt', 'quan_he_voi_chu_ho'];

  dataRight: Array<any> = [];
  dataSourceRight: any;

  changed = false;
  @Output() addEvent = new EventEmitter();
  static instance: any;
  constructor(
    private householdMemberService: HouseholdMemberService,
    public dialog: MatDialog,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
    this.events.subscribe(
      (data: any) => {
        this.data = data;
      });

    this.eventsRight.subscribe(
      (data: any) => {
        this.dataRight = data;
      });

    if(this.quanHeEvents) {
      this.quanHeEvents.subscribe(
        (data: any) => {
          console.log(data)
          data.forEach((value: any) => {
            this.list_nhan_khau.push({
              id_nhan_khau: value.id_thanh_vien,
              quan_he_voi_chu_ho: value.quan_he_voi_chu_ho
            }),
            this.dataMap[value.id_thanh_vien] = value.quan_he_voi_chu_ho
          })
        }
      )
    }

    setTimeout(() => {
      if(this.dataRight.length) {
        this.dataRight.forEach((value: any) =>
          this.data = this.data.filter((x: any) => x.ID != value.ID)
        )
      }
      this.dataSource = new MatTableDataSource<any>(this.data);
      this.dataSourceRight = new MatTableDataSource<any>(this.dataRight);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, 500)
  }

  checkedLeft(nhanKhau: any) {
    this.dataRight.push(nhanKhau);
    this.dataSourceRight = new MatTableDataSource(this.dataRight);

    this.data = this.data.filter((x: any) => x.ID != nhanKhau.ID);
    this.dataSource = new MatTableDataSource(this.data);

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.list_nhan_khau.push({
      id_nhan_khau: nhanKhau.ID,
      quan_he_voi_chu_ho: '',
    });
    this.validParams = false;
  }

  // changeCheckedRight(user_id: any) {
  //   if (this.checkedListRight.includes(user_id)) {
  //     this.checkedListRight = this.checkedListRight.filter(x => x !== user_id);
  //   }
  //   else this.checkedListRight.push(user_id);
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteMember(nhanKhau: any) {
    this.data.push(nhanKhau);
    this.dataSource = new MatTableDataSource(this.data);

    this.dataRight = this.dataRight.filter((x: any) => x.ID != nhanKhau.ID);
    this.dataSourceRight = new MatTableDataSource(this.dataRight);

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.list_nhan_khau = this.list_nhan_khau.filter((x: any) => x.id_nhan_khau != nhanKhau.ID);
    this.checkValid();
  }

  changeQh(id: any, input: any) {
    this.list_nhan_khau.find((x: any) => {
      if(x.id_nhan_khau == id) x.quan_he_voi_chu_ho = input
    })

    this.checkValid();
  }

  checkValid() {
    this.validParams = true;
    if(this.list_nhan_khau == 0) {
      this.validParams = true;
      return;
    }
    this.list_nhan_khau.forEach((value: any) => {
      if(value.quan_he_voi_chu_ho == '') {
        this.validParams = false;
      }
    })
  }

  onAddMember() {
    this.addEvent.emit(this.list_nhan_khau);
    this.toastrService.success('Thay đổi thành viên thành công');
    this.validParams = false;
  }
}
