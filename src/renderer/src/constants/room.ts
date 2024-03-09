export const ROOM_TYPES = [
  "ROOM_PUBLIC",
  "ROOM_PRIVATE",
  "ROOM_OPEN",
  "ROOM_GLOBAL",
  "ROOM_CAPTURE",
] as const;

export const ROOM_TYPE_OPTIONS = [
  {
    value: "ROOM_PUBLIC",
    label: "공개",
  },
  {
    value: "ROOM_PRIVATE",
    label: "비공개",
  },
];
