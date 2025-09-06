import * as React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
  title?: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
  className?: string;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ title, description, type = 'info', duration = 5000, onClose, className }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true);

    React.useEffect(() => {
      if (duration > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => onClose?.(), 300); // Wait for animation
        }, duration);

        return () => clearTimeout(timer);
      }
      return undefined;
    }, [duration, onClose]);

    const handleClose = () => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300);
    };

    const typeConfig = {
      success: {
        icon: CheckCircle,
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        iconColor: 'text-green-600',
        titleColor: 'text-green-800',
        descColor: 'text-green-700',
      },
      error: {
        icon: AlertCircle,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        iconColor: 'text-red-600',
        titleColor: 'text-red-800',
        descColor: 'text-red-700',
      },
      warning: {
        icon: AlertTriangle,
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        iconColor: 'text-yellow-600',
        titleColor: 'text-yellow-800',
        descColor: 'text-yellow-700',
      },
      info: {
        icon: Info,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        iconColor: 'text-blue-600',
        titleColor: 'text-blue-800',
        descColor: 'text-blue-700',
      },
    };

    const config = typeConfig[type];
    const Icon = config.icon;

    if (!isVisible) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          'fixed top-4 right-4 z-50 w-full max-w-sm transform transition-all duration-300 ease-in-out',
          'translate-x-0 opacity-100',
          !isVisible && 'translate-x-full opacity-0',
          className
        )}
      >
        <div className={cn('rounded-lg border p-4 shadow-lg', config.bgColor, config.borderColor)}>
          <div className='flex items-start gap-3'>
            <Icon className={cn('h-5 w-5 mt-0.5', config.iconColor)} />

            <div className='flex-1 min-w-0'>
              {title && <h4 className={cn('font-medium text-sm', config.titleColor)}>{title}</h4>}
              {description && <p className={cn('text-sm mt-1', config.descColor)}>{description}</p>}
            </div>

            {onClose && (
              <button
                onClick={handleClose}
                className={cn(
                  'flex-shrink-0 p-1 rounded-md hover:bg-black/10 transition-colors',
                  config.iconColor
                )}
              >
                <X className='h-4 w-4' />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

Toast.displayName = 'Toast';

export { Toast };
