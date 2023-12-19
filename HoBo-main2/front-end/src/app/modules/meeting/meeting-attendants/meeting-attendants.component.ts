import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { HouseholdMemberService } from 'src/app/services/household-member.service';
import { MeetingAttendantsService } from 'src/app/services/meeting-attendants.service';
import { ConfirmPopupComponent } from '../../confirm-popup/confirm-popup.component';

@Component({
  selector: 'app-meeting-attendants',
  templateUrl: './meeting-attendants.component.html',
  styleUrls: ['./meeting-attendants.component.scss']
})
export class MeetingAttendantsComponent implements OnInit {
  search = '';
  data: any;
  dataSource: any;
  @ViewChild('leftPaginator',{read: MatPaginator}) leftPaginator!: MatPaginator;
  @ViewChild('rightPaginator',{read: MatPaginator}) rightPaginator!: MatPaginator;
  @ViewChild('leftTbSort') leftTbSort!: MatSort;
  @ViewChild('rightTbSort') rightTbSort!: MatSort;
  displayedColumns = ['checkbox', 'ho_ten', 'ngay_sinh', 'gioi_tinh', 'so_cmt'];
  displayedColumnsRight = ['checkbox', 'ho_ten', 'ngay_sinh', 'gioi_tinh', 'so_cmt', 'da_tham_gia'];
  checkedListLeft: any[] = [];
  dataRight: any;
  dataSourceRight: any;
  checkedListRight: any[] = [];
  slideToggleList: any[] = [];
  slideToggleListTemp: any[] = [];
  changed = false
  @Input() id_cuoc_hop!: any;
  constructor(
    private householdMemberService: HouseholdMemberService,
    public dialog: MatDialog,
    private meetingAttendantsService: MeetingAttendantsService,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
    this.searchHouseholdMembers();
    this.searchMeetingInvited();
    this.searchMeetingAttendants();
  }

  searchHouseholdMembers() {
    this.meetingAttendantsService.getMeetingNotInvited(this.id_cuoc_hop).subscribe(
      (res) => {
        this.data = res.data;
        this.dataSource = new MatTableDataSource<any>(this.data);
        this.dataSource.sort = this.leftTbSort;
        this.dataSource.paginator = this.leftPaginator;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  searchMeetingInvited() {
    this.meetingAttendantsService.getMeetingInvited(this.id_cuoc_hop).subscribe(
      (res) => {
        this.dataRight = res.data;
        this.dataSourceRight = new MatTableDataSource<any>(this.dataRight);
        this.dataSourceRight.sort = this.rightTbSort;
        this.dataSourceRight.paginator = this.rightPaginator;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  searchMeetingAttendants(){
    this.meetingAttendantsService.getMeetingAttendants(this.id_cuoc_hop).subscribe(
      (res) => {
        this.slideToggleList = res.data;
        if (this.changed === false){
          this.slideToggleListTemp = res.data;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  changeCheckedLeft(user_id: any) {
    if (this.checkedListLeft.includes(user_id)) {
      this.checkedListLeft = this.checkedListLeft.filter(x => x !== user_id);
    }
    else this.checkedListLeft.push(user_id);
  }

  changeCheckedRight(user_id: any) {
    if (this.checkedListRight.includes(user_id)) {
      this.checkedListRight = this.checkedListRight.filter(x => x !== user_id);
    }
    else this.checkedListRight.push(user_id);
  }

  changeSlideToggle(user_id: any) {
    if (this.slideToggleListTemp.includes(user_id)) {
      this.slideToggleListTemp = this.slideToggleListTemp.filter(x => x !== user_id);
    } else {
      this.slideToggleListTemp = this.slideToggleListTemp.filter(x => x !== user_id);
      this.slideToggleListTemp.push(user_id);
    }
    this.changed = true;
  }

  onAddInvited(idList: any) {
    let params = {
      id_cuoc_hop: this.id_cuoc_hop,
      list_id_nhan_khau: idList
    }
    this.meetingAttendantsService.addMeetingInvited(params).subscribe(
      (res) => {
        this.toastrService.success(res.message);
        this.searchHouseholdMembers();
        this.searchMeetingInvited();
        this.checkedListLeft = [];
      },
      (error) => {
        this.toastrService.error(error.error.message);
        this.checkedListLeft = [];
      }
    );
  }

  onDeleteInvited(idList: any) {
    let params = {
      id_cuoc_hop: this.id_cuoc_hop,
      list_id_nhan_khau: idList
    }
    this.meetingAttendantsService.deleteMeetingInvited(params).subscribe(
      (res) => {
        this.toastrService.success(res.message);
        this.searchHouseholdMembers();
        this.searchMeetingInvited();
        this.checkedListRight = [];
      },
      (error) => {
        this.toastrService.error(error.error.message);
        this.checkedListRight = [];
      }
    );
  }

  onChangeAttendants(idList: any) {
    let addList: any[] = [];
    let deleteList: any[] = [];
    if (idList !== this.slideToggleList) {
      idList.forEach((element: any) => {
        if (!this.slideToggleList.includes(element)) {
          addList.push(element);
        }
      });
      this.slideToggleList.forEach((element: any) => {
        if (!idList.includes(element)) {
          deleteList.push(element);
        }
      });
      let addParams = {
        id_cuoc_hop: this.id_cuoc_hop,
        list_id_nhan_khau: addList
      }
      let deleteParams = {
        id_cuoc_hop: this.id_cuoc_hop,
        list_id_nhan_khau: deleteList
      }
      if (addList.length > 0) {
        this.meetingAttendantsService.addMeetingAttendants(addParams).subscribe(
          (res) => {
            this.toastrService.success(res.message);
            window.location.reload();
          },
          (error) => {
            this.toastrService.error(error.error.message);
            console.log(error);
          }
        );
      }
      if (deleteList.length > 0) {
        this.meetingAttendantsService.deleteMeetingAttendants(deleteParams).subscribe(
          (res) => {
            this.toastrService.success(res.message);
            window.location.reload();
          },
          (error) => {
            this.toastrService.error(error.error.message);
            console.log(error);
          }
        );
      }
      
    }
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
}
}
