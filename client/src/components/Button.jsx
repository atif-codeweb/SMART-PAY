import { Loader2 } from 'lucide-react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    icon: Icon,
    loading = false,
    disabled = false,
    type = 'button',
    onClick,
    className = ''
}) => {
    const variants = {
        primary: 'bg-primary text-white hover:bg-primary/90',
        secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600',
        outline: 'border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:border-primary hover:text-primary',
        danger: 'bg-red-500 text-white hover:bg-red-600',
        ghost: 'text-primary hover:bg-primary/10'
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-6 py-3',
        lg: 'px-8 py-4 text-lg'
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                inline-flex items-center justify-center gap-2 rounded-lg font-semibold
                transition-all duration-200 active:scale-95
                disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
                ${variants[variant] || variants.primary}
                ${sizes[size] || sizes.md}
                ${fullWidth ? 'w-full' : ''}
                ${className}
            `}
        >
            {loading ? (
                <Loader2 size={18} className="animate-spin" />
            ) : (
                Icon && <Icon size={18} />
            )}
            {children}
        </button>
    );
};

export default Button;
