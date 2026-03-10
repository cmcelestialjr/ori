import React from 'react';
import { ToastContainer, ToastContainerProps } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ToastProviderProps extends Partial<ToastContainerProps> {
  children: React.ReactNode;
}

/**
 * ToastProvider component wraps the application with ToastContainer
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({ children, ...props }) => {
  return (
    <>
      {children}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        {...props}
      />
    </>
  );
};