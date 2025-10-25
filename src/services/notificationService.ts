import toast from 'react-hot-toast';

export class NotificationService {
  private static instance: NotificationService;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  success(message: string, options?: any): void {
    toast.success(message, options);
  }

  error(message: string, options?: any): void {
    toast.error(message, options);
  }

  info(message: string, options?: any): void {
    toast(message, { icon: 'ℹ️', ...options });
  }

  warning(message: string, options?: any): void {
    toast(message, { icon: '⚠️', ...options });
  }

  loading(message: string, options?: any): string {
    return toast.loading(message, options);
  }

  dismiss(toastId?: string): void {
    toast.dismiss(toastId);
  }
}

export const notificationService = NotificationService.getInstance();