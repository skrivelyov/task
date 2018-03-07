import { Injectable } from '@angular/core';
import { User } from './user';
import { Observable } from 'rxjs/Observable';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap} from 'rxjs/operators';
import { of } from "rxjs/observable/of";

@Injectable()
export class UserService {

  private usersUrl = 'http://localhost:9100/user';
  private users : User[];

  private httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
  constructor(
    private messageService: MessageService,
    private http: HttpClient,
  ) { }

  private log(message: string) {
    this.messageService.add('userService: ' + message);
  }


  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl)
      .pipe(
        tap(users => this.log(`fetched users`)),
        catchError(this.handleError('getUsers', []))
      );
  }



  getUser(id: number): Observable<User> {
    this.messageService.add(`UserService: fetched user id =${id}`);
    const url = `${this.usersUrl}/${id}`;

    return this.http.get<User>(url)
      .pipe(
        tap(_ => this.log(`fetched user id=${id}`)),
        catchError(this.handleError<User>(`getUser id=${id}`))
      );
  }


  updateUser(user : User) : Observable<any> {
    return this.http.put(`${this.usersUrl}/${user.id}`, user, this.httpOptions)
      .pipe(
        tap(_ => this.log('update user')),
        catchError(this.handleError<any>('updateHero'))
      );
  }

  addUser(user : User): Observable<User> {
    return this.http.post<User>(this.usersUrl, user, this.httpOptions)
      .pipe(
        tap((user: User) => this.log(`added user user id=${user.id}`)),
        catchError(this.handleError<User>('addUser'))
      );
  }

  deleteUser(user : User): Observable<any> {
    return this.http.delete(`${this.usersUrl}/${user.id}`, this.httpOptions)
      .pipe(
        tap(_ => this.log(`deleted user id=${user.id}`)),
        catchError(this.handleError<User>('deleteUser'))
      );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error); // log to console instead


      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
