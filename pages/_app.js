import 'tailwindcss/tailwind.css'
import Layout from '@/components/Layout'

export default function YouBook({ Component, pageProps }) {
    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    )
}
