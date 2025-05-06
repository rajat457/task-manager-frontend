import Navbar from '@/components/Navbar'
import { AppProps } from 'next/app'
import 'bootstrap/dist/css/bootstrap.min.css'
//import '@/app/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar />
      <main style={{ padding: '2rem' }}>
        <Component {...pageProps} />
      </main>
    </>
  )
}

export default MyApp
