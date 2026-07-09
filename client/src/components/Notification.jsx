import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { removeNotification } from '../store/slices/notificationSlice';

const iconMap = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info
};

const styleMap = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
};

const NotificationItem = ({ notification }) => {
    const dispatch = useDispatch();
    const Icon = iconMap[notification.type] || Info;

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(removeNotification(notification.id));
        }, notification.duration || 3000);
        return () => clearTimeout(timer);
    }, [dispatch, notification.id, notification.duration]);

    return (
        <div className={`${styleMap[notification.type] || styleMap.info} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[280px] max-w-sm animate-slideIn`}>
            <Icon size={20} />
            <p className="flex-1 text-sm font-medium">{notification.message}</p>
            <button onClick={() => dispatch(removeNotification(notification.id))}>
                <X size={18} />
            </button>
        </div>
    );
};

const Notification = () => {
    const { notifications } = useSelector((state) => state.notification);

    if (!notifications || notifications.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-[60] space-y-3">
            {notifications.map((n) => (
                <NotificationItem key={n.id} notification={n} />
            ))}
        </div>
    );
};

export default Notification;
