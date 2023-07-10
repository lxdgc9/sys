export class User {
  id: string;
  ufields: {
    username: string;
    phone: string;
    email: string;
  };
  attrs: {
    k: string;
    v: string;
  }[];
  role: {
    name: string;
    permissions: {
      code: string;
    }[];
  };
  spec_permissions: {
    code: string;
  }[];
  is_active: boolean;
}
