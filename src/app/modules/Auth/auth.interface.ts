import { USER_ROLE } from '../user/user.constants';

export interface IAuth {
  email: string;
  password: string;
}

export type TUserRole = keyof typeof USER_ROLE;
