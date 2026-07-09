import { useDispatch } from 'react-redux';
import { showNotification } from '../store/slices/notificationSlice';

// Returns helpers to fire toast notifications
export const useNotification = () => {
    const dispatch = useDispatch();

    const notify = (type, message, duration) =>
        dispatch(showNotification({ type, message, duration }));

    return {
        success: (message, duration) => notify('success', message, duration),
        error: (message, duration) => notify('error', message, duration),
        warning: (message, duration) => notify('warning', message, duration),
        info: (message, duration) => notify('info', message, duration)
    };
};

export default useNotification;
