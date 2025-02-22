import { toast } from "sonner";
type ToastPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "bottom-center";

export const toastMsg = {
  default: (message: string, position?: ToastPosition) =>
    toast(message, {
      position: position || "top-right",
    }),
  success: (message: string, position?: ToastPosition, duration?: number) =>
    toast.success(message, {
      position: position || "top-right",
      duration: duration || 3000,
      dismissible: true,
      closeButton: false,
    }),
  info: (message: string, position?: ToastPosition, isDismissible?: boolean) =>
    toast.info(message, {
      position: position || "top-right",
      dismissible: isDismissible !== undefined ? isDismissible : true,
      closeButton: true,
    }),
  description: (
    message: string,
    description: string,
    position?: ToastPosition,
  ) =>
    toast.message(message, {
      description: description,
      position: position || "top-right",
    }),
  warning: (message: string, position?: ToastPosition) =>
    toast.warning(message, {
      position: position || "top-right",
    }),
  error: (
    message: string,
    position?: ToastPosition,
    duration?: number,
    isDismissible?: boolean,
  ) =>
    toast.error(message, {
      position: position || "top-right",
      closeButton: isDismissible !== undefined ? isDismissible : true,
      duration: duration || 5000,
    }),
};
