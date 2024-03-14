export const QUERY_KEYS = {
  user: {
    all: ["user"],
    me: ["user", "me"],
    single: (id: string) => ["user", "single", id],
    list: (params?: any) => ["user", "list", ...(params ? [params] : [])],
  },
  channel: {
    all: ["channel"],
    single: (id: string) => ({
      all: ["channel", "single", id],
      sub: ["channel", "single", id, "subscription"],
    }),
    list: {
      all: ["channel", "list"],
      public: (params?: any) => [
        "channel",
        "list",
        "public",
        ...(params ? [params] : []),
      ],
      my: ["channel", "list", "my"],
    },
    genre: {
      all: ["genres"],
      list: (params?: any) => ["genres", "list", ...(params ? [params] : [])],
    },
    waiting: {
      all: ["waiting"],
      single: (id: string) => ["waiting", "single", id],
      list: (params?: any) => ["waiting", "list", ...(params ? [params] : [])],
    },
  },
  room: {
    all: ["room"],
    single: (id: string) => ({
      all: ["room", "single", id],
      sub: ["room", "single", id, "subscription"],
      role: ["room", "single", id, "role"],
    }),
    list: {
      all: ["room", "list"],
      public: (params?: any) => [
        "room",
        "list",
        "public",
        ...(params ? [params] : []),
      ],
      my: (params?: any) => ["room", "list", "my", ...(params ? [params] : [])],
      myWithSpaces: (params?: any) => [
        "room",
        "list",
        "myWithSpaces",
        ...(params ? [params] : []),
      ],
    },
  },
  space: {
    all: ["space"],
    capture: ["space", "capture"],
    single: (id: string) => ({
      all: ["space", "single", id],
      write: ["space", "single", id, "write"],
    }),
    list: (params?: any) => ["space", "list", ...(params ? [params] : [])],
  },
};
