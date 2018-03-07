import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users : User[];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() : void {
    this.userService.getUsers().subscribe(resp => this.users = resp['_embedded']['user']);
  }

  add(name: string, surname: string): void {
    name = name.trim();
    surname = surname.trim();
    if (!name || !surname) { return }
    this.userService.addUser({name, surname} as User)
      .subscribe(user => { this.users.push(user)})
  }

}
