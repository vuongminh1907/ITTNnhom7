import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { HouseholdMemberService } from 'src/app/services/household-member.service';
import { StatisticsService } from 'src/app/services/statistics.service';
import { HouseholdMemberInfoComponent } from '../../household-member/household-member-info/household-member-info.component';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {
  ho_khau: any;
  nhan_khau: any;
  tam_tru: any;
  tam_vang: any;
  data = [];
  dataSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  gioi_tinh = 'toan_bo';
  do_tuoi = 'toan_bo';
  tuoi_mode = '';
  tuoi_tu = '';
  tuoi_den = '';
  tuoi: null | {} | undefined;
  thoi_gian: null | {} | undefined;
  tinh_trang = 'toan_bo';
  thoi_gian_mode = '';
  thoi_gian_tu = '';
  thoi_gian_den = '';
  searchStr = '';
  displayedColumns = ['ho_ten', 'so_cmt', 'ngay_sinh', 'gioi_tinh', 'dia_chi_hien_nay', 'action'];
  checkedList: any[] = [];
  queryForm!: FormGroup;

  constructor(
    private statisticsService: StatisticsService,
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private householdMemberService: HouseholdMemberService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getDashboard();
    this.searchHouseholdMembers();
  }

  getDashboard(){
    this.statisticsService.getDashboard().subscribe(
      (res) => {
        this.ho_khau = res.data.ho_khau;
        this.nhan_khau = res.data.nhan_khau;
        this.tam_tru = res.data.tam_tru;
        this.tam_vang = res.data.tam_vang;
      },
      (error) => {
        console.log(error);
      }
    )
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

  isNumber(value: any) {
    return !Number.isNaN(parseInt(value));
  }

  checkValidAge(from: any, to: any){
    return parseInt(to) > parseInt(from);
  }

  checkValidInputs() {
    let message = '';
    if (this.tuoi_mode === '') {
      message = 'Chưa chọn điều kiện thống kê tuổi nhân khẩu';
    } else if (this.tuoi_mode === 'select' && (this.tuoi_tu === '' || this.tuoi_den === '')) {
      message = 'Chưa điền giới hạn tuổi cần thống kê';
    } else if (this.thoi_gian_mode === '') {
      message = 'Chưa chọn điều kiện thời gian thống kê';
    } else if (this.thoi_gian_mode === 'select' && (this.thoi_gian_tu === '' || this.thoi_gian_den === '')) {
      message = 'Chưa điền giới hạn thời gian cần thống kê';
    }
    if (message !== '') {
      this.toastrService.error(message);
      return false;
    } else {
      return true;
    }
    
  }

  onQueryStatistics() {
    let check = this.checkValidInputs();
    if (check) {
      var params = {
        gioi_tinh: this.gioi_tinh,
        do_tuoi: this.do_tuoi,
        tinh_trang: this.tinh_trang,
        tuoi: this.tuoi,
        thoi_gian: this.thoi_gian
      } 
      if (this.tuoi_mode == 'toan_bo') {
        params.tuoi = null;
      } else {
        params.tuoi = {
          start: this.tuoi_tu,
          end: this.tuoi_den
        }
      }
      if (this.thoi_gian_mode == 'toan_bo') {
        params.thoi_gian = null;
      } else {
        params.thoi_gian = {
          start: moment(this.thoi_gian_tu).format('yyyy-MM-DD'),
          end: moment(this.thoi_gian_den).format('yyyy-MM-DD')
        }
      }
      console.log(this.tuoi_mode);
      console.log(this.thoi_gian_mode);
      console.log(params)
      this.statisticsService.getHouseholdMemberStatistics(params).subscribe(
        (res) => {
          this.data = res.data;
          this.dataSource = new MatTableDataSource<any>(this.data);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          console.log(error);
        }
      )
    }
  }
}
