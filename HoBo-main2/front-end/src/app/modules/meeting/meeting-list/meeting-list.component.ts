import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MeetingService } from 'src/app/services/meeting.service';
import { ConfirmPopupComponent } from '../../confirm-popup/confirm-popup.component';
import { MeetingAddComponent } from '../meeting-add/meeting-add.component';
import { MeetingInfoComponent } from '../meeting-info/meeting-info.component';

@Component({
  selector: 'app-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.scss']
})
export class MeetingListComponent implements OnInit {
  data: any
  dataSource: any
  displayedColumns = ['checkbox', 'noi_dung', 'thoi_gian', 'dia_diem', 'action'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  checkedList: any[] = [];

  constructor(
    private meetingService: MeetingService,
    public dialog: MatDialog, 
    private toastrService: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAllMeetings()
  }

  getAllMeetings() {
    this.meetingService.getAllMeetings().subscribe(
      (res) => {
        this.data = res.data;
        this.dataSource = new MatTableDataSource<any>(this.data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onAddMeeting() {
    const dialogRef = this.dialog.open(MeetingAddComponent, {
      width: '680px',
      maxHeight: '80vh',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getAllMeetings();
    })
  }

  onDelete(idList: any) {
    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      data: {
        title: `Bạn có muốn xoá ${idList.length} cuộc họp này không?`,
        text: 'Dữ liệu sẽ được xoá và không khôi phục được',
      },
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let params = {id_list: idList}
        this.meetingService.deleteMeetings(params).subscribe(
          (res) => {
            this.toastrService.success(res.message);
            this.getAllMeetings();
            this.checkedList = [];
          },
          (error) => {
            this.toastrService.error(error.error.message);
            this.checkedList = [];
          }
        )
      }
    });
  }

  changeChecked(id: any) {
    if (this.checkedList.includes(id)) {
      this.checkedList = this.checkedList.filter(x => x !== id);
    }
    else this.checkedList.push(id);
  }

  openMeetingInfo(id: any) {
    this.router.navigate(['home/meeting/detail/', id]);
  }

  // editMeeting(id: any) {
  //   this.meetingService.getMeetingById(id).subscribe(
  //     (res) => {
  //       const dialogRef = this.dialog.open(MeetingEditComponent, {
  //         data: res.data,
  //         width: '680px',
  //         maxHeight: '80vh',
  //         disableClose: true
  //       });
  //       dialogRef.afterClosed().subscribe(() => {
  //         this.getAllMeetings()
  //       })
  //     })
  // }

}
