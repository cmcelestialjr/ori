import { toast, ToastOptions, Id } from 'react-toastify';

// Define toast types
export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
}

// Toast configuration interface
export interface ToastConfig {
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
  autoClose?: number;
  hideProgressBar?: boolean;
  closeOnClick?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
  theme?: 'light' | 'dark' | 'colored';
}

// Default config
const defaultConfig: ToastConfig = {
  position: 'bottom-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'light',
};

/**
 * ToastService class provides methods to show different types of toast notifications
 */
class ToastService {
  private config: ToastConfig;

  constructor(config: ToastConfig = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Show a toast notification
   * @param message - Message to display
   * @param type - Type of toast
   * @param options - Additional toast options
   * @returns Toast ID
   */
  private show(message: string, type: ToastType, options: ToastOptions = {}): Id {
    const toastOptions: ToastOptions = {
      ...this.config,
      ...options,
    };

    switch (type) {
      case ToastType.SUCCESS:
        return toast.success(message, toastOptions);
      case ToastType.ERROR:
        return toast.error(message, toastOptions);
      case ToastType.INFO:
        return toast.info(message, toastOptions);
      case ToastType.WARNING:
        return toast.warning(message, toastOptions);
      default:
        return toast(message, toastOptions);
    }
  }

  /**
   * Show a success toast
   * @param message - Success message
   * @param options - Additional toast options
   * @returns Toast ID
   */
  success(message: string, options: ToastOptions = {}): Id {
    return this.show(message, ToastType.SUCCESS, options);
  }

  /**
   * Show an error toast
   * @param message - Error message
   * @param options - Additional toast options
   * @returns Toast ID
   */
  error(message: string, options: ToastOptions = {}): Id {
    return this.show(message, ToastType.ERROR, options);
  }

  /**
   * Show an info toast
   * @param message - Info message
   * @param options - Additional toast options
   * @returns Toast ID
   */
  info(message: string, options: ToastOptions = {}): Id {
    return this.show(message, ToastType.INFO, options);
  }

  /**
   * Show a warning toast
   * @param message - Warning message
   * @param options - Additional toast options
   * @returns Toast ID
   */
  warning(message: string, options: ToastOptions = {}): Id {
    return this.show(message, ToastType.WARNING, options);
  }

  /**
   * Update an existing toast
   * @param toastId - ID of the toast to update
   * @param message - New message
   * @param options - New options
   */
  update(toastId: Id, message: string, options: ToastOptions = {}): void {
    toast.update(toastId, {
      render: message,
      ...options,
    });
  }

  /**
   * Dismiss a specific toast
   * @param toastId - ID of the toast to dismiss
   */
  dismiss(toastId?: Id): void {
    toast.dismiss(toastId);
  }

  /**
   * Dismiss all toasts
   */
  dismissAll(): void {
    toast.dismiss();
  }

  /**
   * Change the default configuration
   * @param config - New default configuration
   */
  setConfig(config: ToastConfig): void {
    this.config = { ...this.config, ...config };
  }
}

// Create and export a singleton instance
export const toastService = new ToastService();
export default toastService;
