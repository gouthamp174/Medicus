import React from 'react';

export const SessionContext = React.createContext({
  session: {},
  setSession: () => {},
  signIn: () => {},
  signOut: () => {}
});
