export const QUERY_KEYS = {
  user: {
    all: ["user"],
    me: {
      all: ["user", "me"],
      feed: ["user", "me", "feed"],
      profile: ["user", "me", "profile"],
    },
    single: (id: string) => ["user", "single", id],
    list: {
      all: ["user", "list"],
      search: (params?: any) => [
        "user",
        "list",
        "search",
        ...(params ? [params] : []),
      ],
    },
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
      my: (params?: any) => [
        "channel",
        "list",
        "my",
        ...(params ? [params] : []),
      ],
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
      members: ["room", "single", id, "members"],
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
      search: (params?: any) => [
        "room",
        "list",
        "search",
        ...(params ? [params] : []),
      ],
    },
    invitation: (id: string) => ["room", "invitation", id],
  },
  space: {
    all: ["space"],
    capture: ["space", "capture"],
    single: (id: string) => ({
      all: ["space", "single", id],
      write: ["space", "single", id, "write"],
    }),
    list: {
      all: ["space", "list"],
      general: (params?: any) => ["space", "list", ...(params ? [params] : [])],
      search: (params?: any) => [
        "space",
        "list",
        "search",
        ...(params ? [params] : []),
      ],
    },
  },
  feed: {
    all: ["feed"],
    single: (id: string) => ({
      all: ["feed", "single", id],
    }),
    list: {
      all: ["feed", "list"],
      general: (params?: any) => [
        "feed",
        "list",
        "general",
        ...(params ? [params] : []),
      ],
      infinite: (params?: any) => [
        "feed",
        "list",
        "infinite",
        ...(params ? [params] : []),
      ],
      othersInfinite: (params?: any) => [
        "feed",
        "list",
        "othersInfinite",
        ...(params ? [params] : []),
      ],
      myInfinite: (params?: any) => [
        "feed",
        "list",
        "myInfinite",
        ...(params ? [params] : []),
      ],
      search: (params?: any) => [
        "feed",
        "list",
        "search",
        ...(params ? [params] : []),
      ],
    },
  },
};
