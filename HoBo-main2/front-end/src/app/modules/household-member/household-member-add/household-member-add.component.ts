import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HouseholdMemberService } from 'src/app/services/household-member.service';
import { ConfirmPopupComponent } from '../../confirm-popup/confirm-popup.component';
import 'moment/locale/vi';
import * as moment from 'moment';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-household-member-add',
  templateUrl: './household-member-add.component.html',
  styleUrls: ['./household-member-add.component.scss']
})
export class HouseholdMemberAddComponent implements OnInit {
  readonly dinhDangHoTen = /^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\ ]+$/;
  readonly dinhDangDiaChi = /^[0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\ ,\/-]+$/;
  readonly dinhDangSoHoChieu = /^[0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/;
  readonly dinhDangSo = /^[0-9]+$/;
  readonly dinhDangSoCmt = /^([0-9]{9}|[0-9]{12})$/;

  memberForm!: FormGroup;
  check = false;
  coCmt: boolean = false;
  constructor(
    public toastrService: ToastrService,
    public dialog: MatDialog,
    public householdMemberService: HouseholdMemberService,
    public router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.memberForm = new FormGroup({
      ho_ten: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(this.dinhDangHoTen)
      ])),
      biet_danh: new FormControl('', Validators.pattern(this.dinhDangHoTen)),
      ngay_sinh: new FormControl('', Validators.required),
      gioi_tinh: new FormControl('', Validators.required),
      noi_sinh: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(this.dinhDangDiaChi)
      ])),
      nguyen_quan: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(this.dinhDangDiaChi)
      ])),
      dan_toc: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(this.dinhDangHoTen)
      ])),
      ton_giao: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(this.dinhDangHoTen)
      ])),
      quoc_tich: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(this.dinhDangHoTen)
      ])),
      so_ho_chieu: new FormControl('', Validators.compose([
        // Validators.required,
        Validators.pattern(this.dinhDangSoHoChieu)
      ])),
      noi_thuong_tru: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(this.dinhDangDiaChi)
      ])),
      dia_chi_hien_nay: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(this.dinhDangDiaChi)
      ])),
      trinh_do_hoc_van: new FormControl('', Validators.required),
      biet_tieng_dan_toc: new FormControl('', Validators.required),
      trinh_do_ngoai_ngu: new FormControl('', Validators.required),
      nghe_nghiep: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(this.dinhDangHoTen)
      ])),
      noi_lam_viec: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(this.dinhDangDiaChi)
      ])),
      tien_an: new FormControl(''),
      ngay_chuyen_den: new FormControl(''),
      ly_do_chuyen_den: new FormControl(''),
      ngay_chuyen_di: new FormControl(''),
      ly_do_chuyen_di: new FormControl(''),
      dia_chi_moi: new FormControl('', Validators.pattern(this.dinhDangDiaChi)),
      ghi_chu: new FormControl(''),
      so_cmt: new FormControl('', Validators.pattern(this.dinhDangSoCmt)),
      ngay_cap: new FormControl(''),
      noi_cap: new FormControl('', Validators.pattern(this.dinhDangDiaChi))
    })
  }

  onAddButton() {
    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      data: {
        title: 'Bạn có muốn lưu không?',
        text: 'Thông tin sẽ được lưu vào cơ sở dữ liệu'
      },
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.saveValue();
    })
  }

  onCancel() {
    if (this.memberForm.valid && this.memberForm.dirty) {
      const dialogRef = this.dialog.open(ConfirmPopupComponent, {
        data: {
          title: 'Bạn có muốn thoát không?',
          text: 'Dữ liệu đang thay đổi sẽ không được lưu'
        },
        width: '500px',
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(
        (result) => {
          this.check = true;
          this.router.navigate(['home/household-member']);
        }
      )
    } else this.router.navigate(['home/household-member']);
  }

  saveValue() {
    let params = this.memberForm.getRawValue();
    if(!this.coCmt) {
      params['so_cmt'] = '';
      params['ngay_cap'] = null;
      params['noi_cap'] = ''
    }
    params['ngay_sinh'] = moment(params['ngay_sinh']).format('yyyy-MM-DD');
    if (!!params['ngay_chuyen_den']) {
      params['ngay_chuyen_den'] = moment(params['ngay_chuyen_den']).format('yyyy-MM-DD');
    } else params['ngay_chuyen_den'] = null;
    if (!!params['ngay_chuyen_di']) {
      params['ngay_chuyen_di'] = moment(params['ngay_chuyen_di']).format('yyyy-MM-DD');
    } else params['ngay_chuyen_di'] = null;
    if (!!params['ngay_cap']) {
      params['ngay_cap'] = moment(params['ngay_cap']).format('yyyy-MM-DD');
    } else params['ngay_cap'] = null;
    this.householdMemberService.createHouseholdMember(params).subscribe(
      (res) => {
        this.toastrService.success(res.message);
        this.router.navigate(['home/household-member']);

      },
      (error: any) => {
        this.toastrService.error(error.error.message);
      }
    )
    // console.log(params)
  }

  changeCmtChecked(checked: any) {
    this.coCmt = checked
  }
}
