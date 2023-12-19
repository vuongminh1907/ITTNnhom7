import { HouseholdBookService } from 'src/app/services/household-book.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-household-info',
  templateUrl: './household-info.component.html',
  styleUrls: ['./household-info.component.scss']
})
export class HouseholdInfoComponent implements OnInit {
  history: any;
  constructor(
    public dialogRef: MatDialogRef<HouseholdInfoComponent>,
    private householdService: HouseholdBookService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.householdService.getHouseholdHistory(this.data.id).subscribe(
      (res: any) => {
        this.history = res.data;
        console.log(this.history, res.data)
      }
    )
  }

  closePopup() {
    this.dialogRef.close()
  }
}
