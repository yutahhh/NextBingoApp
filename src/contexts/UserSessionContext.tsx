import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

// Initial state
const initialState = {
  userId: null,
  creationTime: null
};

// Actions
const SET_USER = 'SET_USER';

// Reducer
const reducer = (state, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

// Context
const UserSessionContext = createContext<{
  state: typeof initialState;
  dispatch: React.Dispatch<any>;
} | null>(null);

// Provider
export const UserSessionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        const creationTime = user.metadata.creationTime;
        dispatch({ type: SET_USER, payload: { userId: uid, creationTime } });
      } else {
        signInAnonymously(auth)
      }
    });

    return () => unsubscribe();
  }, [auth, dispatch]);

  return (
    <UserSessionContext.Provider value={{ state, dispatch }}>
      {children}
    </UserSessionContext.Provider>
  );
};

// Custom hook
export const useUserSession = () => {
  const context = useContext(UserSessionContext);
  if (!context) {
    throw new Error('useUserSession must be used within a UserSessionProvider');
  }
  return context;
};
