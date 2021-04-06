/* eslint-disable import/no-anonymous-default-export */
import React, { useReducer, useCallback } from 'react';

import reducer, { initState } from './reducer';

const Context = React.createContext();

const Provider = (props) => {
  const [state, dispatch] = useReducer(useCallback(reducer, []), initState);

  return (
    <Context.Provider value={{ state, dispatch }}>
      {props.children}
    </Context.Provider>
  );
};

export default { Context, Provider };