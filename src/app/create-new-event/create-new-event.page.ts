import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";

@Component({
  selector: "app-create-new-event",
  templateUrl: "./create-new-event.page.html",
  styleUrls: ["./create-new-event.page.scss"]
})
export class CreateNewEventPage implements OnInit {
  public dateSelected;
  public createEventForm: FormGroup;
  public datePickerConfig = {
    clearButton: false
  };

  constructor() {}

  ngOnInit() {
    this.createEventForm = new FormGroup({
      eventname: new FormControl(null),
      eventdate: new FormControl(this.dateSelected)
    });
  }

  onSubmit() {
    console.log(this.createEventForm);
  }
}
