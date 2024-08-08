import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { UserFormatted } from "src/app/types/user-response";

@Injectable({
    providedIn: 'root'
  })
  export class ModalService {
    private modalSubject = new BehaviorSubject<boolean>(false);
    private isCreateUserSubject = new BehaviorSubject<boolean>(false);
    private userEditedSubject = new BehaviorSubject<UserFormatted | null>(null);
    private myUserSubject = new BehaviorSubject<UserFormatted | null>(null);
    modal$ = this.modalSubject.asObservable();
    userEdited$ = this.userEditedSubject.asObservable();
    myUser$ = this.myUserSubject.asObservable();
    isCreateUser$ = this.isCreateUserSubject.asObservable();
  
    constructor() {}
  
    openModal(isCreateUser?: boolean) {

      if(isCreateUser) {
        this.isCreateUserSubject.next(isCreateUser);
      }
        this.modalSubject.next(true);
    }

    closeModal() {
        this.userEditedSubject.next(null);
        this.isCreateUserSubject.next(false);
        this.modalSubject.next(false);
    }

    setUserEdited(user: UserFormatted | null) {
      this.userEditedSubject.next(user);
    }

    setMyUser(user: UserFormatted) {
      this.myUserSubject.next(user);
    }

    clearModal() {
      this.closeModal();
      this.userEditedSubject.next({
        id: null,
        email: '',
        name: '',
        lastName: '',
        role: {
          id: 0,
          name: ''
        }
      });
    }
  }