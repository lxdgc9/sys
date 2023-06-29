type PermissionGroup = {
  id: number;
  label: string;
  permissions: number[];
};

const permissionGroups: PermissionGroup[] = [
  {
    id: 1,
    label: "Quản lý hệ thống",
    permissions: [],
  },
  {
    id: 2,
    label: "Truy cập ứng dụng",
    permissions: [],
  },
  {
    id: 3,
    label: "Học liệu điện tử",
    permissions: [],
  },
];

export default permissionGroups;
