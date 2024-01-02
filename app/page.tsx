import Image from 'next/image'
import {HomeNav} from './components/partials/navbar'
import Head from 'next/head'




export default function Home() {
  return (
    <main className="  flex bg-gradient-to-b from-slate-950 to-slate-900 via-gray-950 min-h-screen flex-col items-center justify-between p-24">
      <HomeNav/>
      <Head>
            <title>Certifolio: Secure platform for creating and destributing NFT certificates</title>
        </Head>
      <div className=' my-auto max-w-5xl flex mx-auto'>
      <Header/>
      </div>
      
    </main>
  )
}

const Header = () => {
  return (
    <header className=" text-white py-8">
      <div className="container mx-auto flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4 text-center text-indigo-400">Blockchain Empowered Certificates Platform</h1>
        <p className="text-lg text-center">
        Certifolio provides a secure platform for creating and distributing NFT certificates,
        ensuring authenticity, and anti-counterfeiting measures.
        </p>
        <button className="bg-white text-blue-900 font-bold px-6 py-2 mt-6 rounded-md shadow-md hover:bg-indigo-300 transition duration-300">
          Create a New Certificate
        </button>
      </div>
    </header>
  );
};
