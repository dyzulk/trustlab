import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axios from '@/lib/axios';

declare global {
    interface Window {
        Pusher: typeof Pusher;
        Echo: any;
    }
}

let echo: any;

if (typeof window !== 'undefined') {
    window.Pusher = Pusher;

    echo = new Echo({
        broadcaster: 'reverb',
        key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
        wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
        wsPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT ?? "80"),
        wssPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT ?? "443"),
        forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? 'https') === 'https',
        enabledTransports: ['ws', 'wss'],
        authEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/broadcasting/auth`,
        authorizer: (channel: any, options: any) => {
            return {
                authorize: (socketId: any, callback: any) => {
                    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/broadcasting/auth`, {
                        socket_id: socketId,
                        channel_name: channel.name
                    })
                    .then(response => {
                        callback(false, response.data);
                    })
                    .catch(error => {
                        callback(true, error);
                    });
                }
            };
        },
    });
}

export default echo;

