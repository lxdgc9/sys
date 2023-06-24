type Permission = {
  id      : number;
  code    : string;
  detail  : string;
  group_id: number;
};

const permissions: Permission[] = [
  {
    id      : 1,
    code    : "READ_USER",
    detail  : "Xem thông tin người dùng",
    group_id: 1,
  },
  {
    id      : 2,
    code    : "WRITE_USER",
    detail  : "Tạo người dùng",
    group_id: 1,
  },
  {
    id      : 3,
    code    : "MODIFY_USER",
    detail  : "Chỉnh sửa thông tin người dùng",
    group_id: 1,
  },
  {
    id      : 4,
    code    : "DELETE_USER",
    detail  : "Xóa người dùng",
    group_id: 1,
  },
];

export default permissions;
