import toast from 'react-hot-toast';

/**
 * useToast - wrapper around react-hot-toast with consistent styling
 *
 * Usage:
 * const { success, error, loading, dismiss } = useToast();
 * success('Product created!');
 * error('Something went wrong');
 */
function useToast() {
  const success = (message: string) => {
    toast.success(message, {
      duration: 3000,
      style: {
        borderRadius: '12px',
        fontWeight: '500',
      },
    });
  };

  const error = (message: string) => {
    toast.error(message, {
      duration: 4000,
      style: {
        borderRadius: '12px',
        fontWeight: '500',
      },
    });
  };

  const loading = (message: string) => {
    return toast.loading(message, {
      style: {
        borderRadius: '12px',
        fontWeight: '500',
      },
    });
  };

  const promise = <T,>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string }
  ) => {
    return toast.promise(promise, messages, {
      style: { borderRadius: '12px', fontWeight: '500' },
    });
  };

  const dismiss = (toastId?: string) => {
    toast.dismiss(toastId);
  };

  return { success, error, loading, promise, dismiss };
}

export default useToast;