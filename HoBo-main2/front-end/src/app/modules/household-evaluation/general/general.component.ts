import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HouseholdBookService } from 'src/app/services/household-book.service';
import { HouseholdEvaluationService } from 'src/app/services/household-evaluation.service';
import { EvaluationAddComponent } from '../evaluation-add/evaluation-add.component';
import { EvaluationInfoComponent } from '../evaluation-info/evaluation-info.component';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {
  year: any;
  data: any
  dataSource: any
  displayedColumns = ['checkbox', 'ma_ho_khau', 'ten_chu_ho', 'dia_chi', 'nam_danh_gia', 'action'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  checkedList: any[] = [];

  constructor(
    private evaluationService: HouseholdEvaluationService,
    public dialog: MatDialog, 
    private toastrService: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAllHouseholds()
  }

  getAllHouseholds() {
    this.evaluationService.getAllHouseholdEvaluation().subscribe(
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

  onAddEvaluation() {
    let params = {
      danh_sach_ma_ho_khau: this.checkedList,
      nam_danh_gia: parseInt(this.year)
    }
    this.evaluationService.addHouseholdEvaluation(params).subscribe(
      (res) => {
        this.toastrService.success(res.message);
        this.getAllHouseholds();
        this.checkedList = [];
        this.year = '';
      },
      (error) => {
        this.toastrService.error(error.error.message);
        this.checkedList = [];
      }
    )
  }

  isNumber(value: any) {
    return !Number.isNaN(parseInt(value));
  }

  checkValidYear (value: any) {
    let year = parseInt(value);
    let current_year = new Date().getFullYear();
    if (year <= current_year && year >= 2023) {
      return true;
    } else return false;
  }

  openEvaluationInfo(id: any) {
    this.evaluationService.getHouseholdEvaluation(id).subscribe(
      (res) => {
        const dialogRef = this.dialog.open(EvaluationInfoComponent, {
          data: {
            evaluation_list: res.data['list'],
            info: res.data['info'],
            mode: 'more'
          },
          width: '680px',
          maxHeight: '80vh',
        })
      })
  }

  changeChecked(id: any) {
    if (this.checkedList.includes(id)) {
      this.checkedList = this.checkedList.filter(x => x !== id);
    }
    else this.checkedList.push(id);
  }

}
