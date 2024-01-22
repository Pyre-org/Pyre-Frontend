export const QUERY_KEYS = {
  user: {
    all: ["user"],
    me: ["user", "me"],
    single: (id: number) => ["user", "single", id],
    list: (params?: any) => ["user", "list", ...(params ? [params] : [])],
  },
};
