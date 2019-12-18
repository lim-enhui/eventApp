import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { Ionic4DatepickerModalComponent } from "@logisticinfotech/ionic4-datepicker";
import { ModalController } from "@ionic/angular";

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

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.createEventForm = new FormGroup({
      eventname: new FormControl(null),
      eventdate: new FormControl(this.dateSelected)
    });
  }

  onSubmit() {
    console.log(this.createEventForm);
  }

  async openDatePicker() {
    const datePickerModal = await this.modalController.create({
      component: Ionic4DatepickerModalComponent,
      cssClass: "li-ionic4-datePicker",
      componentProps: {
        objConfig: this.datePickerConfig,
        selectedDate: this.dateSelected
      }
    });
    await datePickerModal.present();

    datePickerModal.onDidDismiss().then(data => {
      console.log(data);
      this.dateSelected = data.data.date;
      this.createEventForm.patchValue({
        eventdate: this.dateSelected
      });
    });
  }
}
