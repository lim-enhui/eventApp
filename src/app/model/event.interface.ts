export interface IEvent {
  createdAt: number;
  creator: string;
  eventaddress: string;
  eventenddate: null | string;
  eventimage: string;
  eventinformation: string;
  eventisonedayevent: boolean;
  eventlat: number;
  eventlng: number;
  eventmode: string;
  eventname: string;
  eventpostal: string;
  eventstartdate: string;
  distance?: number;
}
