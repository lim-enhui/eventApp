export interface IUser {
  uid: string;
  displayName: string;
  photoUrl?: string;
  email: string;
  isSearchable: boolean;
  phoneNumber?: number | null | string;
  company_school?: string;
  occupation?: string;
}
