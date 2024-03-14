export const SPACE_ROOM_TYPES = [
  "ROOM_PUBLIC",
  "ROOM_PRIVATE",
  "ROOM_OPEN",
  "ROOM_GLOBAL",
  "ROOM_CAPTURE",
] as const;

export const SPACE_ROOM_TYPE_OPTIONS = [
  {
    value: "ROOM_PUBLIC",
    label: "공개",
  },
  {
    value: "ROOM_PRIVATE",
    label: "비공개",
  },
];

export const ROOM_ROLE_TYPES = [
  "ROOM_ADMIN",
  "ROOM_MODE",
  "ROOM_USER",
  "ROOM_GUEST",
] as const;

export const ROLE_TYPE_OPTIONS = [
  {
    value: "ROOM_ADMIN",
    label: "관리자",
  },
  {
    value: "ROOM_MODE",
    label: "모더레이터",
  },
  {
    value: "ROOM_USER",
    label: "사용자",
  },
  {
    value: "ROOM_GUEST",
    label: "게스트",
  },
];
