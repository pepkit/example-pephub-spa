import { useEffect, useMemo } from 'react'
import { useLocation, redirect } from 'react-router-dom'
import { useCookies } from 'react-cookie'

const API_BASE = import.meta.env.VITE_BASE_URL
const CLIENT_REDIRECT = import.meta.env.VITE_CLIENT_REDIRECT_URI

const LoginSuccess = () => {
    // cookies
    const [cookies, setCookie] = useCookies(['pephub_session']);

    // url params
    const location = useLocation()
    const params = useMemo(() => {
        const searchParams = new URLSearchParams(location.search)
        return Object.fromEntries(searchParams.entries())
    }, [location.search])

    // watch for changes and get access_token to set cookie
    useEffect(() => {
        if(params.code) {
            fetch(
                `${API_BASE}/auth/token`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        code: params.code,
                        client_redirect_uri: CLIENT_REDIRECT
                    })
                }
            )
            .then(res => res.json())
            .then(data => {
                
                setCookie('pephub_session', data.token, { path: '/' })
                window.location.href = '/'
            })
            .finally(() => {
                redirect('/')
            })
        }
    }, [params.code])

    return (
        <div className="container mx-auto px-4 h-screen">
            <div className="h-full flex flex-col items-center justify-center">
                <img className="animate-bounce" height="100" width="100" src="/pep-dark.svg" />
                <p className="text-4xl font-bold">Logging in...</p>
                <p className="mt-3">
                    If you are not redirected in 5 seconds... 
                    <a className="text-blue-600 ml-2" href="/">click here</a>
                </p>
                {
                    JSON.stringify(params, null, 2)
                }
            </div>
        </div>
    )
}

export default LoginSuccess