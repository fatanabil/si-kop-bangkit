import { useEffect } from 'react';
import formatNumber from '../../utils/formatNumber';

interface NotListedDataModalProps {
    notListedData: any[];
    setNotListedModalOpen: Function;
    setAddMemberOpen: Function;
    notListedModalOpen: boolean;
}

export default function NotListedDataModal({ notListedData, setNotListedModalOpen, setAddMemberOpen, notListedModalOpen }: NotListedDataModalProps) {
    let total = 0;

    useEffect(() => {
        if (notListedModalOpen) {
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [notListedModalOpen]);

    return (
        <div>
            <div onClick={() => setNotListedModalOpen(false)} className='h-screen w-full absolute z-50 top-0 left-0 bg-black opacity-20 transition-all'></div>
            <div className='w-5/6 h-5/6 absolute z-50 top-10 left-1/2 -translate-x-1/2 bg-slate-700 p-8 rounded-lg shadow-lg flex flex-col overflow-auto'>
                <h1 className='text-white text-xl font-semibold'>Tidak Terdaftar</h1>
                <hr className='my-6 border-2 border-slate-600 bg-none' />
                <table className='text-white'>
                    <thead>
                        <tr>
                            <th>No Rek</th>
                            <th>Nama Anggota</th>
                            <th>Jumlah</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notListedData.map((item, i) => {
                            total += parseInt(item.jumlah);
                            return (
                                <tr key={i}>
                                    <td>{item.no_rek}</td>
                                    <td>{item.nama_anggota}</td>
                                    <td>{formatNumber(item.jumlah)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <h4 className='text-2xl text-white my-4'>{`Total = ${formatNumber(total)}`}</h4>
                <button className='px-4 py-2 bg-teal-600 rounded-md text-white hover:bg-teal-500' onClick={() => setNotListedModalOpen(false)}>
                    Tutup
                </button>
                <button
                    className='mt-4 px-4 py-2 bg-slate-600 rounded-md text-white hover:bg-slate-500'
                    onClick={() => {
                        setNotListedModalOpen(false);
                        setAddMemberOpen(true);
                    }}
                >
                    Tambah Semua Anggota Baru
                </button>
            </div>
        </div>
    );
}
