import { DongGopService } from './../../../services/dong-gop.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ConfirmPopupComponent } from '../../confirm-popup/confirm-popup.component';

@Component({
  selector: 'app-dong-gop-add',
  templateUrl: './dong-gop-add.component.html',
  styleUrls: ['./dong-gop-add.component.scss']
})
export class DongGopAddComponent implements OnInit {
  readonly dinhDangSdt = /^[0-9]{9,11}$/;
  readonly dinhDangDiaChi = /^[0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\ ,\/-]+$/;
  readonly dinhDangSoHoChieu = /^[0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/;

  form!: FormGroup;

  constructor(public dialogRef: MatDialogRef<DongGopAddComponent>,
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private dongGopService: DongGopService,
    //private householdMemberService: HouseholdMemberService,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this._locale = 'vi';
    this._adapter.setLocale(this._locale);
  }

  ngOnInit(): void {
    //if (!!this.data) this.nhanKhau = this.data;
    this.initForm();


    // this.form.controls['ten_nhan_khau'].valueChanges.subscribe(
    //   (value) => {
    //     this.getSuggestList(value);
    //   }
    // );
  }

  initForm() {
    this.form = new FormGroup({
      ma_dong_gop: new FormControl(''),
      ten_dong_gop: new FormControl(''),
      han_nop: new FormControl({}, Validators.required),
      mo_ta: new FormControl(''),
      so_tien: new FormControl('', Validators.required)
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



  save() {
    const formValue = this.form.getRawValue();
    let params = {
      ma_dong_gop: formValue['ma_dong_gop'],
      ten_dong_gop: formValue['ten_dong_gop'],
      han_nop: moment(formValue['han_nop']).format('yyyy-MM-DD'),
      mo_ta: formValue['mo_ta'],
      so_tien: formValue['so_tien']
    }

    this.dongGopService.createDongGop(params).subscribe(
      (res) => {
        this.toastrService.success(res.message)
      }, (error) => {
        this.toastrService.error(error.error.message)
      }
    )
  }

}
