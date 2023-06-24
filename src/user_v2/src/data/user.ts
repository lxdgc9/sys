type Attr = {
  k: string;
  v: string;
};

type User = {
  id: number;
  attrs: Attr[];
  role: number;
  spec_perms: number[];
  is_active: boolean;
};

const users: User[] = [];

export default users;
