import { createContext, useContext, useReducer, useCallback } from 'react';
import { ToastContainer } from '../components/ui/Toast';

const initialState = { toasts: [] };

function toastReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return {
        toasts: [
          ...state.toasts,
          {
            id: action.payload.id,
            message: action.payload.message,
            variant: action.payload.variant || 'success',
          },
        ],
      };
    case 'REMOVE':
      return { toasts: state.toasts.filter((t) => t.id !== action.payload) };
    default:
      return state;
  }
}

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [state, dispatch] = useReducer(toastReducer, initialState);

  const addToast = useCallback((message, variant = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    dispatch({ type: 'ADD', payload: { id, message, variant } });
    setTimeout(() => dispatch({ type: 'REMOVE', payload: id }), 4000);
  }, []);

  const value = { addToast };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={state.toasts} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
