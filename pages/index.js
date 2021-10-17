import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/firebase/clientApp'

export default function Home() {
    const [user, loading, error] = useAuthState(auth)
    const router = useRouter()

    useEffect(() => {
        if (user) {
            router.push('/app')
        }
    }, [])

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider()
        await signInWithRedirect(auth, provider)
    }

    return (
        <div className='min-h-screen flex flex-col justify-center'>
            <h1 className='mx-auto mb-16 text-4xl'>Login</h1>
            <button
                onClick={signInWithGoogle}
                className='mx-auto px-3 py-2 text-sm text-white bg-blue-700 hover:bg-blue-800 transition-all rounded'
            >
                Sign in with google
            </button>
        </div>
    )
}
