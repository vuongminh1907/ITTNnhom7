import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { HouseholdBookService } from 'src/app/services/household-book.service';
import { HouseholdMemberService } from 'src/app/services/household-member.service';
import { ConfirmPopupComponent } from '../../confirm-popup/confirm-popup.component';

@Component({
  selector: 'app-household-split',
  templateUrl: './household-split.component.html',
  styleUrls: ['./household-split.component.scss']
})
export class HouseholdSplitComponent implements OnInit {

  readonly dinhDangHoTen = /^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\ ]+$/;
  readonly dinhDangDiaChi = /^[0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\ ,\/-]+$/;
  readonly dinhDangSoHoChieu = /^[0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/;
  readonly dinhDangSo = /^[0-9]+$/;
  readonly dinhDangSoCmt = /^([0-9]{9}|[0-9]{12})$/;

  hoKhauForm!: FormGroup;
  list_nhan_khau: any = [];
  suggestList: any[] = [];
  chuHo: any;
  listSelect: any[] = [];
  eventSubject = new BehaviorSubject<any>(null);
  eventSubjectRight = new BehaviorSubject<any>(null);
  quanHeSubject = new BehaviorSubject<any>(null);
  id: any;
  data: any;
  newChuHo: any

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
    this.setValueForm();
  }


  initForm() {
    this.hoKhauForm = new FormGroup({
      new_ma_ho_khau: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(this.dinhDangSoHoChieu)
      ])),
      new_ten_chu_ho: new FormControl('', Validators.required),
      new_ma_khu_vuc: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(this.dinhDangSoHoChieu)
      ])),
      new_dia_chi: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(this.dinhDangDiaChi)
      ])),
      new_ngay_lap: new FormControl('', Validators.required),
      new_ngay_chuyen_di: new FormControl(''),
      new_ly_do_chuyen: new FormControl('')
    });
  }

  setValueForm() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.householdService.getHouseholdById(this.id).subscribe(
      (res: any) => {
        this.data = res.data
        this.householdMemberService.getHouseholdMember(res.data['id_chu_ho']).subscribe(
          (res: any) => {
            this.chuHo = res.data;
          }
        )

        this.householdMemberService.getAllHouseholdMember().subscribe(
          (res) => {
            let list_id_nhan_khau = this.data.thanh_vien_trong_ho.map((x: any) => x.id_thanh_vien);
            console.log(list_id_nhan_khau)
            let nhanKhau: any[] = [];
            res.data.forEach((x: any) => {
              if(list_id_nhan_khau.includes(x.ID))
                nhanKhau.push(x);
            })
            this.suggestList = nhanKhau
            this.eventSubject.next(nhanKhau);
            this.eventSubjectRight.next([]);
            // this.quanHeSubject.next(this.data.thanh_vien_trong_ho)
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
      new_id_chu_ho: this.newChuHo.ID,
      new_ma_ho_khau: formValue['new_ma_ho_khau'],
      new_ma_khu_vuc: formValue['new_ma_khu_vuc'],
      new_ngay_lap: moment(formValue['new_ngay_lap']).format('yyyy-MM-DD'),
      new_ngay_chuyen_di: !!formValue['new_ngay_chuyen_di'] ? moment(new Date()).format('yyyy-MM-DD') : null,
      new_ly_do_chuyen: formValue['new_ly_do_chuyen'],
      new_dia_chi: formValue['new_dia_chi'],
      new_list_nhan_khau: this.list_nhan_khau
    };

    this.householdService.splitHousehold(this.id, params).subscribe(
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
    this.newChuHo = nhanKhau
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
