import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, BehaviorSubject } from 'rxjs';
import { HouseholdBookService } from 'src/app/services/household-book.service';
import { HouseholdMemberService } from 'src/app/services/household-member.service';
import { ConfirmPopupComponent } from '../../confirm-popup/confirm-popup.component';

@Component({
  selector: 'app-household-edit',
  templateUrl: './household-edit.component.html',
  styleUrls: ['./household-edit.component.scss']
})
export class HouseholdEditComponent implements OnInit {
  readonly dinhDangHoTen = /^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\ ]+$/;
  readonly dinhDangDiaChi = /^[0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\ ,\/-]+$/;
  readonly dinhDangSoHoChieu = /^[0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/;
  readonly dinhDangSo = /^[0-9]+$/;
  readonly dinhDangSoCmt = /^([0-9]{9}|[0-9]{12})$/;

  hoKhauForm!: FormGroup;
  list_nhan_khau: any = [];
  suggestList = [];
  chuHo: any;
  eventSubject = new BehaviorSubject<any>(null);
  eventSubjectRight = new BehaviorSubject<any>(null);
  quanHeSubject = new BehaviorSubject<any>(null);
  id: any;
  data: any;

  constructor(private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private householdMemberService: HouseholdMemberService,
    private householdService: HouseholdBookService,
    private router: Router,
    private route: ActivatedRoute) {
    }

  ngOnInit(): void {
    this.initForm();
    this.getSuggestList('');
    this.hoKhauForm.controls['ten_chu_ho'].valueChanges.subscribe(
      (value: any) => this.getSuggestList(value)
    );
    this.setValueForm();
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
      ]))
    });
  }

  setValueForm() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.householdService.getHouseholdById(this.id).subscribe(
      (res: any) => {
        this.data = res.data;
        this.hoKhauForm.patchValue({dien_tich : res.data['dien_tich']});
        this.hoKhauForm.patchValue({ma_ho_khau : res.data['ma_ho_khau']});
        // this.hoKhauForm.patchValue({ten_chu_ho: res.data['ten_chu_ho']});
        this.hoKhauForm.patchValue({ma_khu_vuc : res.data['ma_khu_vuc']});
        this.hoKhauForm.patchValue({dia_chi: res.data['dia_chi']});
        this.hoKhauForm.patchValue({ngay_lap : new Date(res.data['ngay_lap']) });
        if(res.data['ngay_chuyen_di']) this.hoKhauForm.patchValue({ngay_chuyen_di: new Date(res.data['ngay_chuyen_di'])});
        if(res.data['ly_do_chuyen']) this.hoKhauForm.patchValue({ly_do_chuyen: res.data['ly_do_chuyen']});
        this.householdMemberService.getHouseholdMember(res.data['id_chu_ho']).subscribe(
          (res: any) => {
            this.chuHo = res.data;
            this.hoKhauForm.patchValue({ten_chu_ho: this.chuHo});
          }
        )

        this.householdMemberService.getAllHouseholdMember().subscribe(
          (res) => {
            let list_id_nhan_khau = this.data.thanh_vien_trong_ho.map((x: any) => x.id_thanh_vien);
            console.log(list_id_nhan_khau)
            let nhanKhauOther: any[] = [];
            let nhanKhau: any[] = [];
            res.data.forEach((x: any) => {
              if(!list_id_nhan_khau.includes(x.ID))
                nhanKhauOther.push(x);
              else nhanKhau.push(x);
            })
            this.eventSubject.next(nhanKhauOther);
            this.eventSubjectRight.next(nhanKhau);
            this.quanHeSubject.next(this.data.thanh_vien_trong_ho)
          },
          (error) => console.log(error)
        )

      },
      (error) => {
        this.toastrService.error(error.error.message);
      }
    );
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
      dien_tich: formValue['dien_tich'], // Thêm trường này
      list_nhan_khau: this.list_nhan_khau
    };

    this.householdService.updateHousehold(this.id, params).subscribe(
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
