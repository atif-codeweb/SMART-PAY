const Input = ({
    label,
    icon: Icon,
    error,
    className = '',
    ...props
}) => {
    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Icon size={18} />
                    </span>
                )}
                <input
                    className={`input ${Icon ? 'pl-10' : ''} ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
                    {...props}
                />
            </div>
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
    );
};

export default Input;
