import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import PropTypes from "prop-types";
import { Config } from "src/utils/constants";

const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  SIGN_IN: "SIGN_IN",
  SIGN_OUT: "SIGN_OUT",
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...// if payload (user) is provided, then is authenticated
      (user
        ? {
            isAuthenticated: true,
            isLoading: false,
            user,
          }
        : {
            isLoading: false,
          }),
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    // if (initialized.current) {
    //   return;
    // }

    initialized.current = true;

    const accessToken = window.sessionStorage.getItem("access-token");

    if (accessToken) {
      const userData = await fetch(`${Config.API_URL}/users/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const user = await userData.json();

      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: user,
      });
    } else {
      dispatch({
        type: HANDLERS.INITIALIZE,
      });
    }
  };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const signIn = async (email, password) => {
    if (!email || !password) {
      throw new Error("Please check your email and password");
    }

    const response = await fetch(`${Config.API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    const accessToken = data.tokens.access.token;
    const refreshToken = data.tokens.refresh.token;
    const { user } = data;

    window.sessionStorage.setItem("access-token", accessToken);
    window.sessionStorage.setItem("refresh-token", refreshToken);

    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user,
    });
  };

  const signUp = async (email, name, password) => {
    const response = await fetch(`${Config.API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, name, password }),
    });

    const data = await response.json();

    const accessToken = data.tokens.access.token;
    const refreshToken = data.tokens.refresh.token;
    const { user } = data;

    window.sessionStorage.setItem("access-token", accessToken);
    window.sessionStorage.setItem("refresh-token", refreshToken);

    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user,
    });
  };

  const signOut = () => {
    fetch(`${Config.API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.sessionStorage.getItem("access-token")}`,
      },
      body: JSON.stringify({ refreshToken: window.sessionStorage.getItem("refresh-token") }),
    });

    window.sessionStorage.removeItem("access-token");
    dispatch({
      type: HANDLERS.SIGN_OUT,
    });
  };

  const setUser = (user) => {
    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
