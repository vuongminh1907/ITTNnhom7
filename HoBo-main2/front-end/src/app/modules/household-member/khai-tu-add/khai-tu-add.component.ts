import { ConfirmPopupComponent } from './../../confirm-popup/confirm-popup.component';
import { HouseholdMemberService } from 'src/app/services/household-member.service';
import { KhaiTuService } from './../../../services/khai-tu.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';
import * as moment from 'moment'

@Component({
  selector: 'app-khai-tu-add',
  templateUrl: './khai-tu-add.component.html',
  styleUrls: ['./khai-tu-add.component.scss']
})
export class KhaiTuAddComponent implements OnInit {
  // readonly dinhDangHoTen = /^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\ ]+$/;

  khaiTuForm!: FormGroup;

  nhanKhauList = [];
  nguoiChetSuggestList = [];
  nguoiKhaiSuggestList = [];
  nguoiChet!: any;
  nguoiKhai!: any;

  constructor(public dialogRef: MatDialogRef<KhaiTuAddComponent>,
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private khaiTuService: KhaiTuService,
    private householdMemberService: HouseholdMemberService,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this._locale = 'vi';
      this._adapter.setLocale(this._locale);
     }

  ngOnInit(): void {
    if(!!this.data) this.nguoiChet = this.data;
    this.initForm();

    this.householdMemberService.getAllHouseholdMember().subscribe(
      (res) => {
        this.nhanKhauList = res.data;
        this.nguoiChetSuggestList = this.nhanKhauList;
        this.nguoiKhaiSuggestList = this.nhanKhauList;
      }
    );

    this.khaiTuForm.controls['ten_nguoi_chet'].valueChanges.subscribe(
      (value) => {
        this.getSuggestList('ten_nguoi_chet', value);
      }
    );
    this.khaiTuForm.controls['ten_nguoi_khai'].valueChanges.subscribe(
      (value) => {
        this.getSuggestList('ten_nguoi_khai', value);
      }
    )


  }

  initForm() {
    this.khaiTuForm = new FormGroup({
      ten_nguoi_chet: new FormControl({value: !!this.data ? this.data.ho_ten : '' , disabled: !!this.data}, Validators.compose([
        Validators.required,
        // Validators.pattern(this.dinhDangHoTen)
      ])),
      ten_nguoi_khai: new FormControl('', Validators.compose([
        Validators.required,
        // Validators.pattern(this.dinhDangHoTen)
      ])),
      so_giay_khai_tu: new FormControl('', Validators.required),
      ngay_chet: new FormControl({}, Validators.required),
      ly_do_chet: new FormControl('')
    }
    )

  }

  closePopup() {
    this.dialogRef.close();
  }

  onSaveBtn() {
    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      data: {
        title: 'Bạn có muốn lưu không?',
        text: 'Thông tin sẽ được lưu vào cơ sở dữ liệu'
      },
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveKhaiTu();
        this.dialogRef.close();
      }
    })
  }

  getHouseHoldMemberInfo(field: string, query: string) {
    if(this.khaiTuForm.controls[field].invalid) return;
    this.householdMemberService.searchHouseholdMembers(this.khaiTuForm.controls[field].value, query).subscribe(
      (res) => {
        if(field === 'so_cmt_nguoi_chet')
          this.nguoiChet = res.data;
        else this.nguoiKhai = res.data;
        console.log(this.nguoiChet, this.nguoiKhai)
      }
    )
  }

  saveKhaiTu() {
    const formValue = this.khaiTuForm.getRawValue();
    let params = {
      id_nguoi_chet: this.nguoiChet.ID,
      id_nguoi_khai: this.nguoiKhai.ID,
      ngay_chet: moment(formValue['ngay_chet']).format('yyyy-MM-DD'),
      ngay_khai: moment(new Date()).format('yyyy-MM-DD'),
      ly_do_chet: formValue['ly_do_chet'],
      so_giay_khai_tu: formValue['so_giay_khai_tu']
    }

    this.khaiTuService.createKhaiTu(params).subscribe(
      (res) => {
        this.toastrService.success(res.message)
      }, (error) => {
        this.toastrService.error(error.error.message)
      }
    )
  }

  displayInfo(nhanKhau: any): string {
    return `${nhanKhau['ho_ten']} - ${moment(nhanKhau['ngay_sinh']).format('DD/MM/yyyy')} - ${nhanKhau['dia_chi_hien_nay']}`
  }

  getSuggestList(field: string, name: string) {
    if(field === 'ten_nguoi_khai') {
      this.householdMemberService.searchHouseholdMembers('name', name).subscribe(
        (res) => {
          this.nguoiKhaiSuggestList = res.data
        }
      )
    } else {
      this.householdMemberService.searchHouseholdMembers('name', name).subscribe(
        (res) => {
          this.nguoiChetSuggestList = res.data
        }
      )
    }
  }

  displayFn(any: any): string {
    return any && any.ho_ten ? any.ho_ten : '';
  }

  select(field: string, nhanKhau: any) {
    if(field === 'ten_nguoi_chet') {
      this.nguoiChet = nhanKhau;
    }
    this.nguoiKhai = nhanKhau;
  }
}
