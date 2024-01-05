import { DongGopService } from '../../../services/dong-gop.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ConfirmPopupComponent } from '../../confirm-popup/confirm-popup.component';
import { BatBuocService } from '../../../services/bat-buoc.service';
@Component({
  selector: 'app-bat-buoc-add-money',
  templateUrl: './bat-buoc-add-money.component.html',
  styleUrls: ['./bat-buoc-add-money.component.scss']
})
export class BatBuocAddMoneyComponent implements OnInit {
  readonly dinhDangSdt = /^[0-9]{9,11}$/;
  readonly dinhDangDiaChi = /^[0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\ ,\/-]+$/;
  readonly dinhDangSoHoChieu = /^[0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/;

  form!: FormGroup;

  constructor(public dialogRef: MatDialogRef<BatBuocAddMoneyComponent>,
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private dongGopService: DongGopService,
    private batbuocService : BatBuocService,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this._locale = 'vi';
    this._adapter.setLocale(this._locale);
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      so_tien_da_dong: new FormControl(''),
      ngay_dong: new FormControl(''),
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
      so_tien_da_dong: formValue['so_tien_da_dong'],
      ngay_dong: moment(formValue['ngay_dong']).format('yyyy-MM-DD'),
    }
    this.batbuocService.updateBatBuocById(this.data.ma_ho_khau,this.data.thang,this.data.nam,params).subscribe(
      (res) => {
        this.toastrService.success(res.message)
      }, (error) => {
        this.toastrService.error(error.error.message)
      }
    )
  }

}
