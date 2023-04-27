import { Component } from '@angular/core';
import {FireService} from "./fire.service";
import {MessageDTO} from "../dto";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  sendThisMessage: any;
  findThisId: any;
  IdOfThisMessage: any;
  specificMessage = MessageDTO;
  email: string = "";
  password: string = "";
  editing: boolean = false;
  editText: any;
  constructor(public fireService: FireService) {
    console.log("hello world app")
  }

  async getSpecificMessage(id: any) {
    console.log((this.fireService.getMessageById(id)).userid)
  }

  changeToEdit() {
    this.editing = true;
  }

  cancel() {
    this.editing = false;
  }
}
