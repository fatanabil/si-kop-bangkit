import Link from 'next/link';
import Navlink from './linknav';
import { useContext } from 'react';
import AuthContext from '../contexts/authContext';
import { AuthContextType } from '../types';
import { useRouter } from 'next/router';

export default function Navbar() {
    const router = useRouter();
    const { changeAuthData } = useContext<AuthContextType>(AuthContext);

    const onClickLogoutHandler = () => {
        const option = window.confirm('Apakah anda ingin logout?');

        if (option) {
            changeAuthData({ username: '', token: '', isAuthenticated: false });
            return router.replace('/login');
        }

        return null;
    };

    return (
        <nav className='w-full bg-slate-700 fixed overflow-x-scroll sm:overflow-hidden shadow-lg z-50'>
            <div className='w-full'>
                <div className='h-full w-full flex px-0 gap-8 sm:gap-0 sm:px-16 justify-between'>
                    <div className='h-full flex px-0'>
                        <Navlink href={'/'}>Home</Navlink>
                        <Navlink href={'/member'}>Anggota</Navlink>
                        <Navlink href={'/agency'}>Instansi</Navlink>
                        <Navlink href={'/mutation'}>Mutasi</Navlink>
                        <Navlink href={'/invoice'}>Tagihan</Navlink>
                    </div>
                    <button
                        className='border-2 border-red-400 rounded-md px-4 py-1 text-red-400 hover:text-white hover:bg-red-400 transition-all duration-200 self-center'
                        onClick={onClickLogoutHandler}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}
