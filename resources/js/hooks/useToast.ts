import { useCallback } from 'react';
import { ToastOptions, Id } from 'react-toastify';
import toastService, { ToastConfig } from '../services/toasts/toast.service';
// import toastService, { ToastType, ToastConfig } from '../services/toast/toast.service';

/**
 * Custom hook for using toast notifications
 */
export const useToast = () => {
  const success = useCallback((message: string, options?: ToastOptions) => {
    return toastService.success(message, options);
  }, []);

  const error = useCallback((message: string, options?: ToastOptions) => {
    return toastService.error(message, options);
  }, []);

  const info = useCallback((message: string, options?: ToastOptions) => {
    return toastService.info(message, options);
  }, []);

  const warning = useCallback((message: string, options?: ToastOptions) => {
    return toastService.warning(message, options);
  }, []);

  const update = useCallback((toastId: Id, message: string, options?: ToastOptions) => {
    toastService.update(toastId, message, options);
  }, []);

  const dismiss = useCallback((toastId?: Id) => {
    toastService.dismiss(toastId);
  }, []);

  const dismissAll = useCallback(() => {
    toastService.dismissAll();
  }, []);

  const setConfig = useCallback((config: ToastConfig) => {
    toastService.setConfig(config);
  }, []);

  return {
    success,
    error,
    info,
    warning,
    update,
    dismiss,
    dismissAll,
    setConfig
  };
};