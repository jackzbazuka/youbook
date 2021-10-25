import { createContext, Fragment } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth'
import { useRouter } from 'next/router'
import { Menu, Transition } from '@headlessui/react'
import { auth } from '@/firebase/clientApp'
import Loading from '@/components/Loading'

export const UserContext = createContext()

export default function Layout({ children }) {
    const [user, loading] = useAuthState(auth)
    const data = { user, loading }
    const router = useRouter()

    function signInWithGoogle() {
        const provider = new GoogleAuthProvider()
        signInWithRedirect(auth, provider)
    }

    function signOut() {
        auth.signOut()
        router.push('/')
    }

    return (
        <div>
            {!loading ? (
                <div>
                    <header className='h-16 w-full text-sm text-white bg-gray-800'>
                        <nav className='h-full w-full px-6 flex flex-row justify-between items-center'>
                            <div className='flex flex-row justify-around items-center gap-5'>
                                <div
                                    onClick={() => router.push('/')}
                                    className='mr-10 flex flex-row justify-start items-center hover:cursor-pointer'
                                >
                                    <svg
                                        viewBox='0 0 256 180'
                                        version='1.1'
                                        xmlns='http://www.w3.org/2000/svg'
                                        preserveAspectRatio='xMidYMid'
                                        className='h-6 mr-1'
                                    >
                                        <g>
                                            <path
                                                d='M250.346231,28.0746923 C247.358133,17.0320558 238.732098,8.40602109 227.689461,5.41792308 C207.823743,0 127.868333,0 127.868333,0 C127.868333,0 47.9129229,0.164179487 28.0472049,5.58210256 C17.0045684,8.57020058 8.37853373,17.1962353 5.39043571,28.2388718 C-0.618533519,63.5374615 -2.94988224,117.322662 5.5546152,151.209308 C8.54271322,162.251944 17.1687479,170.877979 28.2113844,173.866077 C48.0771024,179.284 128.032513,179.284 128.032513,179.284 C128.032513,179.284 207.987923,179.284 227.853641,173.866077 C238.896277,170.877979 247.522312,162.251944 250.51041,151.209308 C256.847738,115.861464 258.801474,62.1091 250.346231,28.0746923 Z'
                                                fill='#FF0000'
                                            ></path>
                                            <polygon
                                                fill='#FFFFFF'
                                                points='102.420513 128.06 168.749025 89.642 102.420513 51.224'
                                            ></polygon>
                                        </g>
                                    </svg>
                                    <span className='text-xl font-bold'>
                                        YouBook
                                    </span>
                                </div>
                            </div>
                            <div id='dropdown'>
                                {!user ? (
                                    <button
                                        onClick={signInWithGoogle}
                                        className='px-3 py-1 text-white hover:text-gray-200 border-2 border-white hover:border-gray-200 transition-all rounded-3xl'
                                    >
                                        Login
                                    </button>
                                ) : (
                                    <Menu as='div' className='relative'>
                                        <Menu.Button className='p-2 flex flex-row items-center bg-gray-900 hover:bg-black rounded-xl transition-all'>
                                            <img
                                                src={user.photoURL}
                                                className='h-8 w-8 rounded-full'
                                            />
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                className='ml-1 h-6 w-6 text-white'
                                                viewBox='0 0 20 20'
                                                fill='currentColor'
                                            >
                                                <path
                                                    fillRule='evenodd'
                                                    d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                                                    clipRule='evenodd'
                                                />
                                            </svg>
                                        </Menu.Button>
                                        <Transition
                                            as={Fragment}
                                            enter='transition ease-out duration-100'
                                            enterFrom='transform opacity-0 scale-95'
                                            enterTo='transform opacity-100 scale-100'
                                            leave='transition ease-in duration-75'
                                            leaveFrom='transform opacity-100 scale-100'
                                            leaveTo='transform opacity-0 scale-95'
                                        >
                                            <Menu.Items className='mt-1 p-1 fixed right-5 text-sm origin-top-right bg-black divide-y divide-gray-700 rounded-md focus:outline-none'>
                                                <Menu.Item>
                                                    <button
                                                        onClick={() =>
                                                            router.push(
                                                                '/profile'
                                                            )
                                                        }
                                                        className='p-2 w-full text-white hover:text-gray-200 transition-all'
                                                    >
                                                        My Profile
                                                    </button>
                                                </Menu.Item>
                                                <Menu.Item>
                                                    <button
                                                        onClick={signOut}
                                                        className='p-2 w-full text-red-500 hover:text-red-600 transition-all'
                                                    >
                                                        Logout
                                                    </button>
                                                </Menu.Item>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                )}
                            </div>
                        </nav>
                    </header>
                    <div className='sm:w-5/6 md:w-2/3 lg:w-1/2 mx-auto'>
                        <UserContext.Provider value={data}>
                            {children}
                        </UserContext.Provider>
                    </div>
                </div>
            ) : (
                <Loading />
            )}
        </div>
    )
}
