import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import * as moment from 'moment'

@Component({
  selector: 'app-household-member-info',
  templateUrl: './household-member-info.component.html',
  styleUrls: ['./household-member-info.component.scss']
})
export class HouseholdMemberInfoComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<HouseholdMemberInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

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
    { key: 'so_cmt', value: 'Số CMT/CCCD'},
    { key: 'ngay_cap', value: 'Ngày cấp'},
    { key: 'noi_cap', value: 'Nơi cấp'},
    { key: 'ngay_chuyen_den', value: 'Ngày chuyển đến' },
    { key: 'ly_do_chuyen_den', value: 'Lý do chuyển đến' },
    { key: 'ngay_chuyen_di', value: 'Ngày chuyển đi' },
    { key: 'ly_do_chuyen_di', value: 'Lý do chuyển đi' },
    { key: 'dia_chi_moi', value: 'Địa chỉ mới' },
    { key: 'ghi_chu', value: 'Ghi chú' }
  ]

  ngOnInit(): void {
    this.data['ngay_sinh'] = moment(this.data['ngay_sinh']).format('DD/MM/yyyy');
    if(this.data['ngay_chuyen_den']) this.data['ngay_chuyen_den'] = moment(this.data['ngay_chuyen_den']).format('DD/MM/yyyy');
    if(this.data['ngay_chuyen_di']) this.data['ngay_chuyen_di'] = moment(this.data['ngay_chuyen_di']).format('DD/MM/yyyy');

  }

  closePopup() {
    this.dialogRef.close()
  }
}
