import { DanhSachDongGopService } from './../../../services/danh-sach-dong-gop.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmPopupComponent } from '../../confirm-popup/confirm-popup.component';
import { DongGopService } from './../../../services/dong-gop.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-household-donate-add',
  templateUrl: './household-donate-add.component.html',
  styleUrls: ['./household-donate-add.component.scss']
})
export class HouseholdDonateAddComponent implements OnInit {
  readonly dinhDangSdt = /^[0-9]{9,11}$/;
  readonly dinhDangDiaChi = /^[0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\ ,\/-]+$/;
  readonly dinhDangSoHoChieu = /^[0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/;

  form!: FormGroup;
  danhsachDongGop: any [] = [];
  selectedHoKhauId: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<HouseholdDonateAddComponent>,
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private danhsachDongGopService: DanhSachDongGopService,
    private dongGopService: DongGopService,
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
    this.getDongGopList()
  }

  // Thay bang lay danh sach dong gop
  getDongGopList() {
    this.dongGopService.getAllDongGops().subscribe(
      (res) => {
        this.danhsachDongGop = res.data;
      },
      (error) => console.log(error)
    )
  }

  initForm() {
    this.form = new FormGroup({
      ma_dong_gop: new FormControl([], Validators.required),
      //ngay_ung_ho: new FormControl('', Validators.required),
      so_tien: new FormControl('', Validators.required)
    });
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
    });
  }

  save() {
    // if (!this.selectedDongGopId) {
    //   this.toastrService.error('Vui lòng chọn khoản đóng góp.');
    //   return;
    // }

    const params = this.form.getRawValue();
    // const  params = {
    //   ma_dong_gop: formValue['ma_dong_gop'],
    //   ngay_nop: formValue['ngay_nop'],
    //   so_tien: formValue['so_tien']
    // };

    this.danhsachDongGopService.createHoDongGopById(this.selectedHoKhauId, params).subscribe(
      (res) => {
        this.toastrService.success(res.message);
      },
      (error) => {
        this.toastrService.error(error.error.message);
      }
    );
  }

  // saveGroup() {
  //   const params = this.userGroupForm.getRawValue();
  //   this.userGroupService.createGroup(params).subscribe(
  //     (res) => {
  //       this.toastrService.success(res.message);
  //     }, (error) => {
  //       this.toastrService.error(error.error.message);
  //     }
  //   )
  // }
}
