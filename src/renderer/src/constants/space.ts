export const SPACE_TYPES = [
  "SPACE_FEED",
  "SPACE_CHAT",
  "SPACE_GENERAL",
  "SPACE_GENERAL_CHAT",
] as const;

export const SPACE_TYPE_OPTIONS = [
  { label: "피드", value: "SPACE_FEED" },
  { label: "채팅", value: "SPACE_CHAT" },
];

export const ROLE_TYPES = [
  "SPACEROLE_GUEST",
  "SPACEROLE_USER",
  "SPACEROLE_MODE",
] as const;

export const ROLE_TYPE_OPTIONS = [
  { label: "게스트 허용", value: "SPACEROLE_GUEST" },
  { label: "유저만 허용", value: "SPACEROLE_USER" },
  { label: "모드만 허용", value: "SPACEROLE_MODE" },
];
