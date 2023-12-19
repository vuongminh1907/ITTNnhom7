import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { MeetingService } from 'src/app/services/meeting.service';
import { MeetingPaperService } from 'src/app/services/meeting-paper.service';
import { ConfirmPopupComponent } from '../../confirm-popup/confirm-popup.component';

@Component({
  selector: 'app-meeting-add',
  templateUrl: './meeting-add.component.html',
  styleUrls: ['./meeting-add.component.scss']
})
export class MeetingAddComponent implements OnInit {
  meetingForm!: FormGroup;
  meetingPaperForm!: FormGroup;
  check = false;
  checkBienBan: boolean = false;

  @ViewChild('picker') picker: any;

  public date!: moment.Moment;
  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  public minDate!: moment.Moment;
  public maxDate!: moment.Moment;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public accent: ThemePalette = 'accent';

  constructor(
    public dialogRef: MatDialogRef<MeetingAddComponent>,
    private meetingService: MeetingService,
    public toastrService: ToastrService,
    public router: Router,
    public dialog: MatDialog,
    public meetingPaperService: MeetingPaperService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.meetingForm = new FormGroup({
      noi_dung: new FormControl('', Validators.required),
      thoi_gian: new FormControl('', Validators.required),
      dia_diem: new FormControl('', Validators.required)
    })
    this.meetingPaperForm = new FormGroup({
      id_cuoc_hop: new FormControl(''),
      ban_ve_viec: new FormControl('', Validators.required),
      thong_nhat: new FormControl('', Validators.required),
      thoi_gian_lap: new FormControl('', Validators.required)
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

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.saveValue();
        this.dialogRef.close();
      }
    })
  }

  onCancel() {
    if (this.meetingForm.valid && this.meetingForm.dirty) {
      const dialogRef = this.dialog.open(ConfirmPopupComponent, {
        data: {
          title: 'Bạn có muốn thoát không?',
          text: 'Dữ liệu đang thay đổi sẽ không được lưu'
        },
        width: '500px',
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(
        () => {
          this.check = true;
          this.router.navigate(['home/meeting']);
        }
      )
    }
  }

  closePopup() {
    console.log(this.meetingForm.dirty, this.meetingForm.valid)
    if (this.meetingForm.valid && this.meetingForm.dirty) {
      const dialogRef = this.dialog.open(ConfirmPopupComponent, {
        data: {
          title: 'Bạn có muốn thoát không?',
          text: 'Dữ liệu đang thay đổi sẽ không được lưu'
        },
        width: '500px',
        disableClose: true
      });

      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          this.dialogRef.close();
        }
      });
    }
    else this.dialogRef.close()
  }

  setCheckBienBan(checked: boolean){
    this.checkBienBan = checked;
  }

  saveValue() {
    const params = this.meetingForm.getRawValue();
    params['thoi_gian'] = moment(params['thoi_gian']).format('yyyy-MM-DD HH:mm');
    this.meetingService.createMeeting(params).subscribe(
      (res) => {
        this.toastrService.success(res.message);
        if (this.checkBienBan){
          const params_bienban = this.meetingPaperForm.getRawValue();
          params_bienban['id_cuoc_hop'] = res.data.id;
          params_bienban['thoi_gian_lap'] = moment(params_bienban['thoi_gian_lap']).format('yyyy-MM-DD HH:mm');
          this.meetingPaperService.createMeetingPaper(params_bienban).subscribe(
            (res1) => {
              this.router.navigate(['home/meeting']);
            },
            (error) => {
              this.toastrService.error(error.error.message);
            }
          )
        }
      },
      (error: any) => {
        this.toastrService.error(error.error.message);
      }
    )
  }
}
