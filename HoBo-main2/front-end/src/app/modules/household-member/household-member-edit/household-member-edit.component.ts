import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HouseholdMemberAddComponent } from './../household-member-add/household-member-add.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HouseholdMemberService } from 'src/app/services/household-member.service';
import * as moment from 'moment';

@Component({
  selector: 'app-household-member-edit',
  templateUrl: './household-member-edit.component.html',
  styleUrls: ['./household-member-edit.component.scss']
})
export class HouseholdMemberEditComponent extends HouseholdMemberAddComponent implements OnInit {

  dict = [
    { key: 'ho_ten', value: 'Họ và tên' },
    { key: 'biet_danh', value: 'Biệt danh' },
    { key: 'ngay_sinh', value: 'Ngày sinh' },
    { key: 'gioi_tinh', value: 'Giới tính'},
    { key: 'noi_sinh', value: 'Nơi sinh' },
    { key: 'nguyen_quan', value: 'Nguyên quán' },
    { key: 'dan_toc', value: 'Dân tộc' },
    { key: 'ton_giao', value: 'Tôn giáo' },
    { key: 'quoc_tich', value: 'Quốc tịch' },
    { key: 'so_ho_chieu', value: 'Số hộ chiếu' },
    { key: 'noi_thuong_tru', value: 'Nơi thường trú' },
    { key: 'dia_chi_hien_nay', value: 'Địa chỉ hiện nay' },
    { key: 'trinh_do_hoc_van', value: 'Trình độ học vấn'},
    { key: 'biet_tieng_dan_toc', value: 'Biết tiếng dân tộc' },
    { key: 'trinh_do_ngoai_ngu', value: 'Trình độ ngoại ngữ'},
    { key: 'nghe_nghiep', value: 'Nghề nghiệp'},
    { key: 'noi_lam_viec', value: 'Nơi làm việc'},
    { key: 'tien_an', value: 'Tiền án'},
    { key: 'ngay_chuyen_den', value: 'Ngày chuyển đến' },
    { key: 'ly_do_chuyen_den', value: 'Lý do chuyển đến' },
    { key: 'ngay_chuyen_di', value: 'Ngày chuyển đi' },
    { key: 'ly_do_chuyen_di', value: 'Lý do chuyển đi' },
    { key: 'dia_chi_moi', value: 'Địa chỉ mới' },
    { key: 'ghi_chu', value: 'Ghi chú' },
    { key: 'so_cmt', value: 'Số CMT/CCCD'},
    { key: 'ngay_cap', value: 'Ngày cấp'},
    { key: 'noi_cap', value: 'Nơi cấp'}
  ];
  id: any;
  data!: any;

  constructor(private route: ActivatedRoute,
    public override toastrService: ToastrService,
    public override dialog: MatDialog,
    public override householdMemberService: HouseholdMemberService,
    public override router: Router) {
    super(toastrService, dialog, householdMemberService, router);
  }

  override ngOnInit(): void {
    this.initForm();
    this.setValueForm()
  }

  setValueForm() {
    this.id = this.route.snapshot.paramMap.get('id');
     this.householdMemberService.getHouseholdMember(this.id).subscribe(
      (res: any) => {
        this.data = res.data;
        this.coCmt = !!this.data['so_cmt'] ;
        this.dict.forEach((item: any) => {
          if(item.key === 'ngay_sinh') {
            this.memberForm.patchValue({[item.key]: new Date(this.data[item.key])})
          }
          else if(item.key === 'ngay_chuyen_den' || item.key === 'ngay_chuyen_di' || item.key === 'ngay_cap') {
            if(!!this.data[item.key]) this.memberForm.patchValue({[item.key]: new Date(this.data[item.key])})
          }
          else this.memberForm.patchValue({[item.key] : this.data[item.key]});
        });
      },
      (error) => {
        this.toastrService.error(error.error.message);
      }
    );
  }

  override saveValue(): void {
    let params = this.memberForm.getRawValue();
    if(!this.coCmt) {
      params['so_cmt'] = '';
      params['ngay_cap'] = null;
      params['noi_cap'] = '';
    }
    params['ngay_sinh'] = moment(params['ngay_sinh']).format('yyyy-MM-DD');
    if (!!params['ngay_chuyen_den']) {
      params['ngay_chuyen_den'] = moment(params['ngay_chuyen_den']).format('yyyy-MM-DD');
    } else params['ngay_chuyen_den'] = null;
    if (!!params['ngay_chuyen_di']) {
      params['ngay_chuyen_di'] = moment(params['ngay_chuyen_di']).format('yyyy-MM-DD');
    } else params['ngay_chuyen_di'] = null;
    if (!!params['ngay_capi']) {
      params['ngay_cap'] = moment(params['ngay_cap']).format('yyyy-MM-DD');
    } else params['ngay_cap'] = null;
    this.householdMemberService.updateHouseholdMember(this.id, params).subscribe(
      (res) => {
        this.check = true;
        this.toastrService.success(res.message);
        this.router.navigate(['home/household-member']);
      },
      (error: any) => {
        this.toastrService.error(error.error.message);
      }
    )
  }
}
