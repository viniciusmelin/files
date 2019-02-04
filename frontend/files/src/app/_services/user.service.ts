import { User } from './../_models/user.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = 'http://localhost:8000/';
  private urlApi = 'http://localhost:8000/api/';

  constructor(private http: HttpClient) { }

  getAll(token: String) {
    return this.http.post<User>(this.urlApi + `user`, { token: token });
  }
}
