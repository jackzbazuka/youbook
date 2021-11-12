import { createContext, Fragment } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth'
import { useRouter } from 'next/router'
import { Menu, Transition } from '@headlessui/react'
import { auth } from '@/lib/clientApp'
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
									className='mr-10 flex flex-row justify-start items-center hover:cursor-pointer gap-2'>
									<img src='/logo.png' className='h-7' />
									<span className='text-2xl font-medium'>
										YouBook
									</span>
								</div>
							</div>
							<div id='dropdown'>
								{!user ? (
									<button
										onClick={signInWithGoogle}
										className='px-3 py-1 text-white hover:text-gray-200 border border-white hover:border-gray-200 transition-all rounded-xl'>
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
												fill='currentColor'>
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
											leaveTo='transform opacity-0 scale-95'>
											<Menu.Items className='mt-1 p-1 fixed right-5 text-sm origin-top-right bg-black divide-y divide-gray-700 rounded-md focus:outline-none'>
												<Menu.Item>
													<button
														onClick={() =>
															router.push(
																'/profile'
															)
														}
														className='p-2 w-full text-white hover:text-gray-200 transition-all'>
														My Profile
													</button>
												</Menu.Item>
												<Menu.Item>
													<button
														onClick={signOut}
														className='p-2 w-full text-red-500 hover:text-red-600 transition-all'>
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
					<footer className='w-full mt-20 px-10 py-20 grid place-items-center text-sm text-white bg-gray-800'>
						<p>
							Made by{' '}
							<a
								href='https://milindsathe.io/'
								target='_blank'
								className='lg:hover:text-green-500 transition-all duration-300'>
								Milind
							</a>{' '}
							and Uday
						</p>
					</footer>
				</div>
			) : (
				<Loading />
			)}
		</div>
	)
}
