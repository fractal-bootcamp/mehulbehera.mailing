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

export type EmailBlast = {
  list: List;
  from: string;
  subject: string;
  message: string;
};
