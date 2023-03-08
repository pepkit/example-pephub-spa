import jwt_decode from 'jwt-decode';
import { useCookies } from 'react-cookie';
import { redirect } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_BASE_URL
const CLIENT_REDIRECT = import.meta.env.VITE_CLIENT_REDIRECT_URI

function Home() {
  const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);

  const fetchNamespaceInfo = () => {
    fetch(
      `${API_BASE}/api/v1/namespaces/${jwt_decode(cookies.pephub_session).login}/projects`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.pephub_session}`
        }
      }
    )
    .then(res => res.json())
    .then(data => {
      alert(JSON.stringify(data, null, 2))
    })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold">
        Welcome to the PEPhub SPA
      </h1>
      <div className='my-4'>
      {
        cookies.pephub_session ? (
          <div>
            <div className='flex flex-row items-center py-4 border-b'>
              <button
                onClick={() => {
                  removeCookie('pephub_session')
                  window.location.reload()
                }}
                className='mr-1 px-3 py-1 border-2 border-black rounded-md text-white bg-black hover:text-black hover:bg-white transition-all'
              >
                Log Out
              </button>
              <button
                onClick={fetchNamespaceInfo}
                className='mr-1 px-3 py-1 border-2 border-black rounded-md text-white bg-black hover:text-black hover:bg-white transition-all'
              >
                Fetch Namespace Info
              </button>
            </div>
            <div className='flex flex-row items-center'>
              <img
                className='my-3 rounded-full border-2 border-black'
                height='75'
                width='75'
                src={jwt_decode(cookies.pephub_session).avatar_url}
              />
              <div className='ml-3'>
                <span className='font-bold text-4xl'>
                  {jwt_decode(cookies.pephub_session).login}
                </span>
              </div>
            </div>
            <p className='my-3 text-xl font-bold'>Session Info:</p>
            <div className='my-3'>
              <pre className='text-sm'>
                {
                  JSON.stringify(jwt_decode(cookies.pephub_session), null, 2)
                }
              </pre>
            </div>
          </div>
        ) : (
          <div>
            <a href={`${API_BASE}/auth/login?client_redirect_uri=${CLIENT_REDIRECT}`}>
              <button 
                className='px-3 py-1 border-2 border-black rounded-md text-white bg-black hover:text-black hover:bg-white transition-all'
              >
                Log in
              </button>
            </a>
          </div>
        )
      }
      </div>
    </div>
  )
}

export default Home