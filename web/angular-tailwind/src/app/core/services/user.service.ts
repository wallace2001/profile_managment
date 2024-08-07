import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { User, UserFormatted, UserRequest } from 'src/app/types/user-response';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersSubject = new BehaviorSubject<UserFormatted[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  users$ = this.usersSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  private authToken: any;

  constructor(private authService: AuthService, private toastService: ToastService) {
    this.loadUsers();
    this.authToken = localStorage.getItem('auth-token');
  }

  loadUsers() {
    this.authService.getUsers(this.authToken).subscribe({
      next: (data) => {
        const users = data.users.map(user => ({
          name: user.name,
          email: user.email,
          id: user.id,
          lastName: user.last_name,
          role: user?.roles[0] || { id: 0, name: '' },
        }));
        this.usersSubject.next(users);
      },
      error: () => {
        this.toastService.openToast(
          "Erro",
          "toast-danger"
        );
      }
    });
  }

  addUser(user: UserRequest, onCloseModal: () => void) {
    let newUser: UserFormatted;
    this.loadingSubject.next(true);
    this.authService.createUser(user).subscribe({
        next: (value) => {
            newUser = {
                id: value.user.id,
                name: value.user.name,
                lastName: value.user.last_name,
                email: value.user.email,
                role: value.user.roles[0],
            } as UserFormatted;

        },
        complete: () => {
            const currentUsers = this.usersSubject.value;
            this.usersSubject.next([...currentUsers, newUser]);
            onCloseModal();
            this.loadingSubject.next(false);
            this.toastService.openToast(
              "Usuário criado com sucesso!",
              "toast-success"
            );
        },
        error: (err) => {
            this.loadingSubject.next(false);
            this.toastService.openToast(
              err.error.message,
              "toast-danger"
            );
        }
      });
  }

  updateUser(idUser: number, updatedUser: UserRequest, onCloseModal: () => void) {
    if (!idUser) return;
    this.loadingSubject.next(true);
    let newUser: UserFormatted;
    this.authService.updateUser(idUser, updatedUser).subscribe({
        next: (value) => {
            newUser = {
                id: value.user.id,
                name: value.user.name,
                lastName: value.user.last_name,
                email: value.user.email,
                role: value.user.roles[0],
            } as UserFormatted;
        },
        complete: () => {
            const currentUsers = this.usersSubject.value.map(user =>
                user.id === idUser ? newUser : user
            );
            this.usersSubject.next(currentUsers);
            this.loadingSubject.next(false);
            onCloseModal();
            this.toastService.openToast(
              "Usuário atualizado com sucesso!",
              "toast-success"
            );
        },
        error: () => {
          this.loadingSubject.next(false);
          this.toastService.openToast(
            "Erro ao atualizar usuário",
            "toast-danger"
          );
        }
      });
  }

  deleteUser(userId: number, onCloseModal: () => void) {
    this.loadingSubject.next(true);
    this.authService.deleteUser(userId).subscribe({
        complete: () => {
            const currentUsers = this.usersSubject.value.filter(user => user.id !== userId);
            this.loadingSubject.next(false);
            this.usersSubject.next(currentUsers);
            this.toastService.openToast(
              "Usuário deletado com sucesso!",
              "toast-success"
            );
            onCloseModal();
        },
        error: () => {
            this.loadingSubject.next(false);
            this.toastService.openToast(
              "Erro ao deletar usuário",
              "toast-danger"
            );
            onCloseModal();
        }
    });

  }
}
