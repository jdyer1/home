import React from "react";

export const FooterContext = React.createContext({
  lastModified: null as string | null,
  setLastModified: (_: string | null) => {},
});
