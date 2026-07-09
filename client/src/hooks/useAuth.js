import { useSelector } from 'react-redux';

// Convenience hook to access auth state
export const useAuth = () => {
    const auth = useSelector((state) => state.auth);
    return {
        user: auth.user,
        token: auth.token,
        isAuthenticated: auth.isAuthenticated,
        loading: auth.loading,
        error: auth.error
    };
};

export default useAuth;
