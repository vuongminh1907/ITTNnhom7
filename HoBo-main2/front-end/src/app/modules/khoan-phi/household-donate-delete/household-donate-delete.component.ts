import { DanhSachDongGopService } from './../../../services/danh-sach-dong-gop.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmPopupComponent } from '../../confirm-popup/confirm-popup.component';

@Component({
  selector: 'app-household-donate-delete',
  templateUrl: './household-donate-delete.component.html',
  styleUrls: ['./household-donate-delete.component.scss']
})
export class HouseholdDonateDeleteComponent implements OnInit {
  readonly dinhDangSdt = /^[0-9]{9,11}$/;
  readonly dinhDangDiaChi = /^[0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\ ,\/-]+$/;
  readonly dinhDangSoHoChieu = /^[0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/;

  form!: FormGroup;
  daDongGop: any[] = [];
  selectedHoKhauId: string | null = null;
  constructor(
    public dialogRef: MatDialogRef<HouseholdDonateDeleteComponent>,
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private danhsachDongGopService: DanhSachDongGopService,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this._locale = 'vi';
    this._adapter.setLocale(this._locale);
  }

  ngOnInit(): void {
    this.initForm();
    this.selectedHoKhauId = this.data.selectedHoKhauId;
    this.danhsachDongGopService.getHoDongGopById(this.selectedHoKhauId).subscribe(
      (res) => {
        this.daDongGop = res.data.fees;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  initForm() {
    this.form = new FormGroup({
      ma_list: new FormControl([], Validators.required),
    });
  }

  closePopup() {
    this.dialogRef.close();
  }

  onSaveBtn() {
    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      data: {
        title: 'Bạn có muốn xóa không?',
        text: 'Các khoản đóng góp đã chọn sẽ bị xóa.'
      },
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteSelectedDongGops();
        this.dialogRef.close();
      }
    });
  }

  deleteSelectedDongGops() {
    // if (this.selectedDongGopIds.length === 0) {
    //   this.toastrService.warning('Vui lòng chọn ít nhất một khoản đóng góp để xóa.');
    //   return;
    // }
    const params = this.form.getRawValue();
    this.danhsachDongGopService.deleteHoDongGopsById(this.selectedHoKhauId, params).subscribe(
      (res) => {
        this.toastrService.success(res.message);
      },
      (error) => {
        this.toastrService.error(error.error.message);
      }
    );
  }
}
