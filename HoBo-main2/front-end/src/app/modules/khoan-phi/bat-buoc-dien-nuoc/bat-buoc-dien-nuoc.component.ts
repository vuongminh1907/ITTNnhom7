import { DongGopService } from '../../../services/dong-gop.service';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ConfirmPopupComponent } from '../../confirm-popup/confirm-popup.component';
import { BatBuocService } from '../../../services/bat-buoc.service';
import * as path from 'path';
@Component({
  selector: 'app-bat-buoc-dien-nuoc',
  templateUrl: './bat-buoc-dien-nuoc.component.html',
  styleUrls: ['./bat-buoc-dien-nuoc.component.scss']
})
export class BatBuocDienNuocComponent implements OnInit {
  readonly dinhDangSdt = /^[0-9]{9,11}$/;
  readonly dinhDangDiaChi = /^[0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\ ,\/-]+$/;
  readonly dinhDangSoHoChieu = /^[0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/;

  form!: FormGroup;

  constructor(public dialogRef: MatDialogRef<BatBuocDienNuocComponent>,
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private dongGopService: DongGopService,
    private batbuocService: BatBuocService,
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
      link_excel: new FormControl(''),
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
    const params = this.form.getRawValue();

    this.batbuocService.getFileExcel(params).subscribe(
      (res) => {
        this.toastrService.success(res.message);
      }, (error) => {
        this.toastrService.error(error.error.message);
      }
    );
  }

  // Thêm ViewChild để có thể truy cập đến input file từ template
  @ViewChild('fileInput') fileInput: any;

  // Hàm xử lý sự kiện khi nhấn nút "Chọn File Excel"
  onSelectFile(): void {
    // Sử dụng click() để mở hộp thoại chọn file
    this.fileInput.nativeElement.click();
  }

  // Hàm xử lý sự kiện khi file được chọn
  onFileSelected(event: any): void {
    const fileInput = event.target;
    const file = fileInput.files[0];
  
    if (file) {
      // Thêm đường dẫn trước tên file
      const fullPath = 'D:\\Minh.data\\ITTN\\Công nghệ phần mềm\\' + file.name;
  
      // Cập nhật giá trị trong ô "Điền đường dẫn đến file Excel" khi file được chọn
      this.form.patchValue({
        link_excel: fullPath
      });
    }
  }
}
