import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { HouseholdMemberService } from 'src/app/services/household-member.service';
import { MeetingOwnerService } from 'src/app/services/meeting-owner.service';
import { ConfirmPopupComponent } from '../../confirm-popup/confirm-popup.component';

@Component({
  selector: 'app-meeting-owner',
  templateUrl: './meeting-owner.component.html',
  styleUrls: ['./meeting-owner.component.scss']
})
export class MeetingOwnerComponent implements OnInit {
  search = '';
  data: any;
  dataSource: any;
  @ViewChild('leftPaginator',{read: MatPaginator}) leftPaginator!: MatPaginator;
  @ViewChild('rightPaginator',{read: MatPaginator}) rightPaginator!: MatPaginator;
  @ViewChild('leftTbSort') leftTbSort!: MatSort;
  @ViewChild('rightTbSort') rightTbSort!: MatSort;
  displayedColumns = ['checkbox', 'ho_ten', 'ngay_sinh', 'gioi_tinh', 'so_cmt'];
  displayedColumnsRight = ['checkbox', 'ho_ten', 'ngay_sinh', 'gioi_tinh', 'so_cmt'];
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
    private meetingOwnerService: MeetingOwnerService,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
    this.searchHouseholdMembers();
    this.searchMeetingOwners();
  }

  searchHouseholdMembers() {
    this.householdMemberService.getAllHouseholdMember().subscribe(
      (res) => {
        this.data = res.data;
        console.log(res.data);
        this.meetingOwnerService.getMeetingOwners(this.id_cuoc_hop).subscribe(
          (res1) => {
            res1.data.forEach((nk:any) => {
              this.data = this.data.filter((x: any) => x['ID'] !== nk['id_nhan_khau'])
            });
            console.log(res1.data);
            this.dataSource = new MatTableDataSource<any>(this.data);
            this.dataSource.sort = this.leftTbSort;
            this.dataSource.paginator = this.leftPaginator;
          },
          (error1) => {
            console.log(error1);
          }
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  searchMeetingOwners() {
    this.meetingOwnerService.getMeetingOwners(this.id_cuoc_hop).subscribe(
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

  onAddInvited(idList: any) {
    let params = {
      id_cuoc_hop: this.id_cuoc_hop,
      list_id_nhan_khau: idList
    }
    this.meetingOwnerService.addMeetingOwners(params).subscribe(
      (res) => {
        this.toastrService.success(res.message);
        this.searchHouseholdMembers();
        this.searchMeetingOwners();
        this.checkedListLeft = [];
      },
      (error) => {
        this.toastrService.error(error.error.message);
        this.checkedListLeft = [];
      }
    );
  }

  onDeleteOwners(idList: any) {
    let params = {
      id_cuoc_hop: this.id_cuoc_hop,
      list_id_nhan_khau: idList
    }
    this.meetingOwnerService.deleteMeetingOwners(params).subscribe(
      (res) => {
        this.toastrService.success(res.message);
        this.searchHouseholdMembers();
        this.searchMeetingOwners();
        this.checkedListRight = [];
      },
      (error) => {
        this.toastrService.error(error.error.message);
        this.checkedListRight = [];
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
}
}
