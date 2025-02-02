export interface IUser {
  uid: string;
  login: string;
  password: string;
  displayName?: string | null; // Allow string, null, or undefined
  createdAt: Date;
  type: string;
}
