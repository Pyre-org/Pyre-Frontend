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
    single: (id: string) => ["room", "single", id],
    list: {
      all: ["room", "list"],
      public: (params?: any) => [
        "room",
        "list",
        "public",
        ...(params ? [params] : []),
      ],
      my: (params?: any) => ["room", "list", "my", ...(params ? [params] : [])],
    },
  },
  space: {
    all: ["space"],
    single: (id: string) => ["space", "single", id],
    list: (params?: any) => ["space", "list", ...(params ? [params] : [])],
  },
};
