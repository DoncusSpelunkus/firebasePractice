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
  specificMessage: any = "";
  email: string = "";
  password: string = "";
  editing: boolean = false;
  editText: any;
  constructor(public fireService: FireService) {
    this.findThisId = "";
  }

  async getSpecificMessage(id: any) {
    this.specificMessage = this.fireService.findUserid(id)
  }

  changeToEdit() {
    this.editing = true;
  }

  cancel() {
    this.editing = false;
  }
}
