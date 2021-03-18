import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BasicSnack, SnackAction, SnackSubject } from '../interfaces/snackbar.interface';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private snackService = new Subject<SnackSubject>();

  get(): Observable<any> {
    return this.snackService.asObservable();
  }

  add(snack: BasicSnack): void {
    this.snackService.next({
      action: SnackAction.ADD,
      data: snack
    });
  }

  remove(id: string): void {
    this.snackService.next({ action: SnackAction.REMOVE, id: id });
  }

  clear(): void {
    this.snackService.next({ action: SnackAction.CLEAR });
  }
}