import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export interface IToastStatus {
    status: '' | 'toast-success' | 'toast-danger',
    message: string;
    visible: boolean;
}

@Injectable({
    providedIn: 'root'
  })
  export class ToastService {
    private toastSubject = new BehaviorSubject<IToastStatus>({status: '', message: '', visible: true});
    toast$ = this.toastSubject.asObservable();
  
    constructor() {}
  
    openToast(message: string, status: '' | 'toast-success' | 'toast-danger') {
        this.toastSubject.next({
            status,
            visible: true,
            message
        });
    }

    closeToast() {
        this.toastSubject.next({
            status: '',
            visible: false,
            message: ''
        });
    }
  }