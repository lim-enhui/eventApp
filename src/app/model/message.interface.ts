import { IUser } from "./user.interface";

export interface IMessage {
  chats: Array<IChat>;
  recipients: Array<string>;
  id: string;
}

export interface IChat {
  content: string;
  createdAt: Date;
  uid: IUser;
}
