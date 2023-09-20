import React, { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  board: [],
  isHost: false
};

// Actions
const SET_BOARD = 'SET_BOARD';

// Reducer
const reducer = (state, action) => {
  switch (action.type) {
    case SET_BOARD:
      return { ...state, board: action.payload };
    default:
      return state;
  }
};

// Context
const BingoContext = createContext();

// Provider
export const BingoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <BingoContext.Provider value={{ state, dispatch }}>
      {children}
    </BingoContext.Provider>
  );
};

// Custom hook
export const useBingo = () => {
  const context = useContext(BingoContext);
  if (!context) {
    throw new Error('useBingo must be used within a BingoProvider');
  }
  return context;
};
