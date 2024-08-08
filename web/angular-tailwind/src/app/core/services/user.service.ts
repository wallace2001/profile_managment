import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { UserFormatted, UserRequest } from 'src/app/types/user-response';
import { ToastService } from './toast.service';
import { ModalService } from './modal.service';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/modules/layout/services/loading.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersSubject = new BehaviorSubject<UserFormatted[]>([]);
  private userSubject = new BehaviorSubject<UserFormatted | any>({});
  private loadingSubject = new BehaviorSubject<boolean>(false);
  users$ = this.usersSubject.asObservable();
  user$ = this.userSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  private authToken: any;

  constructor(private authService: AuthService, private router: Router, private loadingService: LoadingService, private toastService: ToastService, private modalService: ModalService) {
    this.authToken = localStorage.getItem('auth-token');
    this.loadUsers();
    this.loadUser();
  }

  setUser(user: UserFormatted) {
    this.userSubject.next(user);
  }

  loadUser() {
    if (!this.authToken) return;
    this.loadingService.setLoading(true);
    this.authService.getUser(this.authToken).subscribe({
      next: (data) => {
        this.userSubject.next({
          name: data.user.name,
          email: data.user.email,
          id: data.user.id,
          lastName: data.user.last_name,
          role: data.user?.roles[0] || { id: 0, name: '' },
        });
      },
      complete: () => {
        this.user$.subscribe(() => {
          this.router.navigate(['/dashboard/home']);
          this.loadingService.setLoading(false);
        })
      },
      error: (err) => {
        this.toastService.openToast(
          "Erro ao buscar perfil",
          'toast-danger'
        );
        localStorage.removeItem('auth-token');
        this.loadingService.setLoading(false);
      },
    });
  }

  loadUsers() {
    if (!this.authToken) return;
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
            this.modalService.closeModal();
            this.loadingSubject.next(false);
            this.toastService.openToast(
              "Usuário criado com sucesso!",
              "toast-success"
            );
            onCloseModal();
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
            this.modalService.closeModal();
            this.toastService.openToast(
              "Usuário atualizado com sucesso!",
              "toast-success"
            );
            onCloseModal();
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

  deleteUser(userId: number) {
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
            this.modalService.closeModal();
        },
        error: () => {
            this.loadingSubject.next(false);
            this.toastService.openToast(
              "Erro ao deletar usuário",
              "toast-danger"
            );
            this.modalService.closeModal();
        }
    });

  }
}
