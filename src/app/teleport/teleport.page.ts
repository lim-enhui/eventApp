import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-teleport",
  templateUrl: "./teleport.page.html",
  styleUrls: ["./teleport.page.scss"]
})
export class TeleportPage implements OnInit {
  title: string = "My first AGM project";
  latitude: number = 1.3483;
  longitude: number = 103.6831;
  zoom: number = 18;

  constructor() {}

  ngOnInit() {}

  onChoseLocation(event) {
    this.latitude = event.coords.lat;
    this.longitude = event.coords.lng;
  }
}
