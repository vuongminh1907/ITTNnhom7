import { TamVangService } from './../../../services/tam-vang.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { HouseholdMemberService } from 'src/app/services/household-member.service';
import { ConfirmPopupComponent } from '../../confirm-popup/confirm-popup.component';

@Component({
  selector: 'app-tam-vang-add',
  templateUrl: './tam-vang-add.component.html',
  styleUrls: ['./tam-vang-add.component.scss']
})
export class TamVangAddComponent implements OnInit {
  readonly dinhDangSdt = /^[0-9]{9,11}$/;
  readonly dinhDangDiaChi = /^[0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\ ,\/-]+$/;
  readonly dinhDangSoHoChieu = /^[0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/;

  form!: FormGroup;
  nhanKhau: any;

  nhanKhauList = [];
  suggestList = [];

  constructor(public dialogRef: MatDialogRef<TamVangAddComponent>,
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private tamVangService: TamVangService,
    private householdMemberService: HouseholdMemberService,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this._locale = 'vi';
    this._adapter.setLocale(this._locale);
  }

  ngOnInit(): void {
    if (!!this.data) this.nhanKhau = this.data;
    this.initForm();

    this.householdMemberService.getAllHouseholdMember().subscribe(
      (res) => {
        this.nhanKhauList = res.data;
        this.suggestList = this.nhanKhauList;
      }
    );

    this.form.controls['ten_nhan_khau'].valueChanges.subscribe(
      (value) => {
        this.getSuggestList(value);
      }
    );
  }

  initForm() {
    this.form = new FormGroup({
      ten_nhan_khau: new FormControl({ value: !!this.data ? this.data.ho_ten : '', disabled: !!this.data }, Validators.compose([
        Validators.required,
        // Validators.pattern(this.dinhDangHoTen)
      ])),
      ma_giay_tam_vang: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(this.dinhDangSoHoChieu)
      ])),
      tu_ngay: new FormControl({}, Validators.required),
      den_ngay: new FormControl({}, Validators.required),
      ly_do: new FormControl(''),
      noi_tam_vang: new FormControl('', Validators.pattern(this.dinhDangDiaChi))
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
        this.save();
        this.dialogRef.close();
      }
    })
  }

  getHouseHoldMemberInfo(query: string) {
    this.householdMemberService.searchHouseholdMembers(this.form.controls['ten_nhan_khau'].value, query).subscribe(
      (res) => {
        this.nhanKhau = res.data;
      }
    )
  }

  save() {
    const formValue = this.form.getRawValue();
    let params = {
      id_nhan_khau: this.nhanKhau.ID,
      ma_giay_tam_vang: formValue['ma_giay_tam_vang'],
      tu_ngay: moment(formValue['tu_ngay']).format('yyyy-MM-DD'),
      den_ngay: moment(formValue['den_ngay']).format('yyyy-MM-DD'),
      ly_do: formValue['ly_do'],
      noi_tam_tru: formValue['noi_tam_vang']
    }

    this.tamVangService.createTamVang(params).subscribe(
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

  getSuggestList(name: string) {
    this.householdMemberService.searchHouseholdMembers('name', name).subscribe(
      (res) => {
        this.suggestList = res.data
      }
    )
  }

  displayFn(any: any): string {
    return any && any.ho_ten ? any.ho_ten : '';
  }

  select(nhanKhau: any) {
    this.nhanKhau = nhanKhau
  }
}
