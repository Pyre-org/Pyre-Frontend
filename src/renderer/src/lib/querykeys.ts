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
    list: (params?: any) => ["channel", "list", ...(params ? [params] : [])],
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
