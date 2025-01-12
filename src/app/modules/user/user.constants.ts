export type TAuthUser = {
  email: string;
  password: string;
  username: string;
  name: string;
};

export type TAuthAdmin = {
  email: string;
  password: string;
  key: string;
};

export const USER_ROLE = {
  user: 'user',
  admin: 'admin',
  superAdmin: 'superAdmin',
} as const;
