export type User = {
  id: string;
  name: string;
  email: string;
};

export type List = {
  id: string;
  name: string;
  users: User[];
};
