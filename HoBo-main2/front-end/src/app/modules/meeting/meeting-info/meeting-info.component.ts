import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Route, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { MeetingPaperService } from 'src/app/services/meeting-paper.service';
import { MeetingService } from 'src/app/services/meeting.service';
import { ConfirmPopupComponent } from '../../confirm-popup/confirm-popup.component';

@Component({
  selector: 'app-meeting-info',
  templateUrl: './meeting-info.component.html',
  styleUrls: ['./meeting-info.component.scss']
})
export class MeetingInfoComponent implements OnInit {
  public data: any;
  id: any;
  id_bien_ban: any;
  meetingForm!: FormGroup;
  meetingPaperForm!: FormGroup;
  thoi_gian: any;
  hasBienBan: any;

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

  dict = [
    { key: 'noi_dung'},
    { key: 'thoi_gian', value: 'Thời gian' },
    { key: 'dia_diem', value: 'Địa điểm' }
  ]

  dict1 = [
    { key: 'id_cuoc_hop'},
    { key: 'ban_ve_viec'},
    { key: 'thong_nhat'},
    { key: 'thoi_gian_lap'}
  ]

  constructor(
    // public dialogRef: MatDialogRef<MeetingInfoComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: {meeting: any, mode: 'more'|'basic'},
    public meetingService: MeetingService,
    public meetingPaperService: MeetingPaperService,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    public toastrService: ToastrService,
    public router: Router,
    ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.checkHasMeeting();
    this.initForm();
    this.setMeetingForm();
    this.setMeetingPaperForm();
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

  checkHasMeeting(){
    this.meetingPaperService.checkHasMeetingPaper(this.id).subscribe(
      (res: any) => {
        this.hasBienBan = res.data.check;
      },
      (error) => {
        console.log(error);
      })
  }

  setMeetingForm(){
    this.meetingService.getMeetingById(this.id).subscribe(
      (res: any) => {
        const data = res.data;
        this.dict.forEach((item: any) => {
          if(item.key === 'thoi_gian') {
            this.meetingForm.patchValue({[item.key]: new Date(data[item.key])})
          }
          else this.meetingForm.patchValue({[item.key] : data[item.key]});
        });
        
      },
      (error) => {
        console.log(error);
      })
  }

  setMeetingPaperForm(){
    this.meetingPaperService.checkHasMeetingPaper(this.id).subscribe(
      (res: any) => {
        if (res.data.check) {
          this.meetingPaperService.getMeetingPaperByMeetingId(this.id).subscribe(
            (res: any) => {
              const data = res.data;
              console.log(data);
              this.dict1.forEach((item: any) => {
                if(item.key === 'thoi_gian_lap') {
                  this.meetingPaperForm.patchValue({[item.key]: new Date(data[item.key])})
                }
                else this.meetingPaperForm.patchValue({[item.key] : data[item.key]});
              });
            },
            (error) => {
              console.log(error);
            });
        }
      },
      (error) => {
        console.log(error);
      })
  }

  onSaveMeetingButton() {
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
        this.saveMeetingValue();
      }
    })
  }

  saveMeetingValue() {
    const params = this.meetingForm.getRawValue();
    params['thoi_gian'] = moment(params['thoi_gian']).format('yyyy-MM-DD HH:mm');
    this.meetingService.updateMeeting(this.id, params).subscribe(
      (res) => {
        this.toastrService.success(res.message);
        window.location.reload();
      },
      (error: any) => {
        this.toastrService.error(error.error.message);
      }
    )
  }

  onSaveMeetingPaperButton() {
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
        this.saveMeetingPaperValue();
      }
    })
  }

  onDeleteMeetingPaperButton() {
    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      data: {
        title: 'Bạn có muốn xóa không?',
        text: 'Thông tin sẽ bị xóa vĩnh viễn'
      },
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.deleteMeetingPaper();
      }
    })
  }

  saveMeetingPaperValue() {
    const params = this.meetingPaperForm.getRawValue();
    params['thoi_gian_lap'] = moment(params['thoi_gian_lap']).format('yyyy-MM-DD HH:mm');
    params['id_cuoc_hop'] = this.id;
    this.meetingPaperService.checkHasMeetingPaper(this.id).subscribe(
      (res: any) => {
        if (res.data.check) {
          this.meetingPaperService.getMeetingPaperByMeetingId(this.id).subscribe(
            (res: any) => {
              const data = res.data;
              this.id_bien_ban = data['id_bien_ban'];
            },
            (error) => {
              console.log(error);
            });
          this.meetingPaperService.updateMeetingPaper(this.id_bien_ban, params).subscribe(
            (res) => {
              this.toastrService.success(res.message);
              window.location.reload();
            },
            (error: any) => {
              this.toastrService.error(error.error.message);
            }
          )
        } else {
          this.meetingPaperService.createMeetingPaper(params).subscribe(
            (res) => {
              this.toastrService.success(res.message);
              window.location.reload();
            },
            (error: any) => {
              this.toastrService.error(error.error.message);
            }
          )
        }
      },
      (error) => {
        console.log(error);
      })
    
  }

  deleteMeetingPaper() {
    this.meetingPaperService.checkHasMeetingPaper(this.id).subscribe(
      (res: any) => {
        if (res.data.check) {
          this.meetingPaperService.getMeetingPaperByMeetingId(this.id).subscribe(
            (res: any) => {
              const data = res.data;
              this.id_bien_ban = data['id_bien_ban'];
              let params = {id_list: [this.id_bien_ban]}
              this.meetingPaperService.deleteMeetingPapers(params).subscribe(
                (res) => {
                  this.toastrService.success(res.message);
                  window.location.reload();
                },
                (error: any) => {
                  this.toastrService.error(error.error.message);
                }
              )
            },
            (error) => {
              console.log(error);
            });
          
        }
      },
      (error) => {
        console.log(error);
      })
    
  }

}
