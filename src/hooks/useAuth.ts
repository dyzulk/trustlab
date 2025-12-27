import useSWR from 'swr';
import axios from '@/lib/axios';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useAuth = ({ middleware, redirectIfAuthenticated }: { middleware?: string, redirectIfAuthenticated?: string } = {}) => {
    const router = useRouter();

    const { data: user, error, mutate } = useSWR('/api/user', () =>
        axios
            .get('/api/user')
            .then(res => res.data)
            .catch(error => {
                if (error.response.status !== 409) throw error;
                router.push('/verify-email');
            })
    );

    const csrf = () => axios.get('/sanctum/csrf-cookie');

    const register = async ({ setErrors, ...props }: any) => {
        await csrf();
        setErrors([]);
        axios
            .post('/register', props)
            .then(() => mutate())
            .catch(error => {
                if (error.response.status !== 422) throw error;
                setErrors(error.response.data.errors);
            });
    };

    const login = async ({ setErrors, setStatus, ...props }: any) => {
        await csrf();
        setErrors([]);
        setStatus && setStatus(null);
        return axios
            .post('/login', props)
            .then(response => {
                mutate();
                return response;
            })
            .catch(error => {
                if (error.response.status !== 422) throw error;
                setErrors(error.response.data.errors);
                throw error;
            });
    };

    const logout = async () => {
        if (!error) {
            await axios.post('/logout').then(() => mutate());
        }
        window.location.pathname = '/signin';
    };

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user)
            router.push(user.default_landing_page || redirectIfAuthenticated);
        // if (window.location.pathname === '/verify-email' && user?.email_verified_at)
        //     router.push(redirectIfAuthenticated);
        if (middleware === 'auth' && error) logout();
    }, [user, error, middleware, redirectIfAuthenticated, router]);

    return {
        user,
        mutate,
        register,
        login,
        logout,
    };
};
