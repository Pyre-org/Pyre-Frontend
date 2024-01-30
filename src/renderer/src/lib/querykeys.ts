export const QUERY_KEYS = {
  user: {
    all: ["user"],
    me: ["user", "me"],
    single: (id: number) => ["user", "single", id],
    list: (params?: any) => ["user", "list", ...(params ? [params] : [])],
  },
  channel: {
    all: ["channel"],
    single: (id: number) => ["channel", "single", id],
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
      single: (id: number) => ["waiting", "single", id],
      list: (params?: any) => ["waiting", "list", ...(params ? [params] : [])],
    },
  },
};
