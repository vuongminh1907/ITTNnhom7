import { HouseholdBookMemberComponent } from './../household-book-member/household-book-member.component';
import { Router } from '@angular/router';
import { HouseholdBookService } from './../../../services/household-book.service';
import { HouseholdMemberService } from './../../../services/household-member.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ConfirmPopupComponent } from '../../confirm-popup/confirm-popup.component';
import { Subject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-household-add',
  templateUrl: './household-add.component.html',
  styleUrls: ['./household-add.component.scss']
})
export class HouseholdAddComponent implements OnInit {
  readonly dinhDangHoTen = /^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\ ]+$/;
  readonly dinhDangDiaChi = /^[0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\ ,\/-]+$/;
  readonly dinhDangSoHoChieu = /^[0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/;
  readonly dinhDangSo = /^[0-9]+$/;
  readonly dinhDangSoCmt = /^([0-9]{9}|[0-9]{12})$/;

  hoKhauForm!: FormGroup;
  list_nhan_khau: any = [];
  suggestList = [];
  chuHo: any;
  allNhanKhau = [];
  eventSubject = new BehaviorSubject<any>(null);
  eventSubjectRight = new BehaviorSubject<any>(null);

  constructor(private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private householdMemberService: HouseholdMemberService,
    private householdService: HouseholdBookService,
    private router: Router) {
      this.householdMemberService.getAllHouseholdMember().subscribe(
        (res) => {
          this.eventSubject.next(res.data)
        },
        (error) => console.log(error)
      )
      this.eventSubjectRight.next([]);
    }

  ngOnInit(): void {
    this.initForm();
    this.getSuggestList('')
    this.hoKhauForm.controls['ten_chu_ho'].valueChanges.subscribe(
      (value: any) => this.getSuggestList(value)
    );
  }


  initForm() {
    this.hoKhauForm = new FormGroup({
      ma_ho_khau: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(this.dinhDangSoHoChieu)
      ])),
      ten_chu_ho: new FormControl('', Validators.required),
      ma_khu_vuc: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(this.dinhDangSoHoChieu)
      ])),
      dia_chi: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(this.dinhDangDiaChi)
      ])),
      ngay_lap: new FormControl('', Validators.required),
      ngay_chuyen_di: new FormControl(''),
      ly_do_chuyen: new FormControl(''),
      dien_tich: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(this.dinhDangSo), // Sử dụng dinhDangSo cho số nguyên
      ])),
      xe_may: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(this.dinhDangSo), // Sử dụng dinhDangSo cho số nguyên
      ])),
      o_to: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(this.dinhDangSo), // Sử dụng dinhDangSo cho số nguyên
      ]))

    });
  }

  getHouseHoldMemberInfo(field: string, query: string) {
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
      }
    })
  }

  save() {
    const formValue = this.hoKhauForm.getRawValue();
    let params: any = {
      id_chu_ho: this.chuHo.ID,
      ma_ho_khau: formValue['ma_ho_khau'],
      ma_khu_vuc: formValue['ma_khu_vuc'],
      ngay_lap: moment(formValue['ngay_lap']).format('yyyy-MM-DD'),
      ngay_chuyen_di: !!formValue['ngay_chuyen_di'] ? moment(new Date()).format('yyyy-MM-DD') : null,
      ly_do_chuyen: formValue['ly_do_chuyen'],
      dia_chi: formValue['dia_chi'],
      o_to: formValue['o_to'],
      xe_may: formValue['xe_may'],
      dien_tich: formValue['dien_tich'], // Thêm trường này
      list_nhan_khau: this.list_nhan_khau
    };

    this.householdService.createHousehold(params).subscribe(
      (res) => {
        this.toastrService.success(res.message);
        this.router.navigate(['home/household-book'])
      },
      (error) => {
        this.toastrService.error(error.error.message)
      }
    )

  }

  displayInfo(nhanKhau: any): string {
    return `${nhanKhau['ho_ten']} - ${moment(nhanKhau['ngay_sinh']).format('DD/MM/yyyy')} - ${nhanKhau['dia_chi_hien_nay']}`;
  }

  getSuggestList(value: any) {
    this.householdMemberService.searchHouseholdMembers('name', value).subscribe(
      (res) => {
        this.suggestList = res.data;
      }
    );
  }

  displayFn(any: any): string {
    return any && any.ho_ten ? any.ho_ten : '';
  }

  select(nhanKhau: any) {
    this.chuHo = nhanKhau
  }

  onCancel() {
    if (this.hoKhauForm.valid && this.hoKhauForm.dirty) {
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
          this.router.navigate(['home/household-book']);
        }
      )
    } else this.router.navigate(['home/household-book']);
  }

}
