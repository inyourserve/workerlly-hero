import { useState, useCallback } from 'react';

interface ToastProps {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = useCallback(({ title, description, variant = 'default' }: ToastProps) => {
    setToasts((prevToasts) => [...prevToasts, { title, description, variant }]);
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.slice(1));
    }, 3000);
  }, []);

  const ToastContainer = () => (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
      {toasts.map((t, i) => (
        <div
          key={i}
          className={`mb-2 p-4 rounded-md shadow-md ${
            t.variant === 'destructive' ? 'bg-red-500' : 'bg-gray-800'
          } text-white`}
        >
          <h3 className="font-bold">{t.title}</h3>
          <p>{t.description}</p>
        </div>
      ))}
    </div>
  );

  return { toast, ToastContainer };
}

// Explicitly export `toast` for named imports
export const toast = (props: ToastProps) => {
  const { toast } = useToast();
  toast(props);
};
