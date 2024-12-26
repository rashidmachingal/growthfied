export type SignupDataTypes = {
  username: string;
  mobile_number: number;
  email: string;
  password: string;
};

export type LoginDataTypes = {
  email: string;
  password: string;
};

export type ResetPasswordTypes = {
  email: string
  password: string
  confirm_password: string
}