import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private toastrService: ToastrService) { }

  handleError(error: HttpErrorResponse) {
    console.error('e', error);
    return throwError(() => error);
}
}
