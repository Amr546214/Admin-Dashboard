import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';

const AUTH_TOKEN_KEY = 'crud_dashboard_token';
const AUTH_USER_KEY = 'crud_dashboard_user';

const initialState = {
  token: localStorage.getItem(AUTH_TOKEN_KEY) || null,
  user: (() => {
    try {
      const u = localStorage.getItem(AUTH_USER_KEY);
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })(),
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { token: action.payload.token, user: action.payload.user };
    case 'LOGOUT':
      return { token: null, user: null };
    default:
      return state;
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (state.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, state.token);
      if (state.user) localStorage.setItem(AUTH_USER_KEY, JSON.stringify(state.user));
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, [state.token, state.user]);

  const login = useCallback((token, user) => {
    dispatch({ type: 'LOGIN', payload: { token, user } });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  const value = {
    token: state.token,
    user: state.user,
    isAuthenticated: !!state.token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
