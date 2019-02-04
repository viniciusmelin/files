import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../_models/user.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AutheticationService {

  private url = 'http://localhost:8000/';
  private urlApi = 'http://localhost:8000/api/';

  private usuarioAutenticado = false;
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  monstrarMenuEmitter = new EventEmitter<boolean>();

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
    return this.http.post<any>(this.url + `login`, { email, password })
      .pipe(map(user => {
        if (user && user.result === 'success') {
          localStorage.setItem('currentUser', JSON.stringify(user.user));
          this.usuarioAutenticado = true;
          this.monstrarMenuEmitter.emit(true);
          this.currentUserSubject.next(user);
        }
        return user;
      }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.usuarioAutenticado = false;
    this.monstrarMenuEmitter.emit(false);
    this.currentUserSubject.next(null);
  }
}
