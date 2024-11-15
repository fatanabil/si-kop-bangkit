import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import AddButton from '../components/buttons/addButton';
import Layout from '../components/layout';
import AddMutationModal from '../components/modals/addMutationModal';
import AuthContext from '../contexts/authContext';
import { AgencyType, MutationType } from '../types';
import { SearchMutationDatabyMonthService } from '../services/mutation-service';
import { GetAgencyDataService } from '../services/agency-service';

export default function Mutation() {
    const router = useRouter();
    const { authData, changeAuthData } = useContext(AuthContext);
    const [mutData, setMutData] = useState<MutationType[]>([]);
    const [bulan, setBulan] = useState(
        () => `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().length < 2 ? `0${new Date().getMonth() + 1}` : `${new Date().getMonth() + 1}`}`
    );
    const [record, setRecord] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [agencyName, setAgencyName] = useState<AgencyType[]>([]);

    const onSearchMutationData = async () => {
        const { response, data, refreshToken } = await SearchMutationDatabyMonthService({ bulan });
        if (response.ok) {
            if (refreshToken) {
                changeAuthData({ ...authData, token: refreshToken });
            }
            setMutData(data);
            setRecord(data.length);
        } else {
            if (response.status === 401) {
                changeAuthData({ username: '', token: '', isAuthenticated: false });
                return router.replace('/login');
            }
        }
    };

    const getAgencyNameData = async () => {
        const { response, data, refreshToken } = await GetAgencyDataService();
        if (response.ok) {
            if (refreshToken) {
                changeAuthData({ ...authData, token: refreshToken });
            }
            setAgencyName(data);
        } else {
            if (response.status === 401) {
                changeAuthData({ username: '', token: '', isAuthenticated: false });
                return router.replace('/login');
            }
        }
    };

    useEffect(() => {
        onSearchMutationData();
    }, [bulan]);

    useEffect(() => {
        getAgencyNameData();
    }, []);

    return (
        <Layout title='SI-KOP-BANGKIT | Mutasi'>
            <div className='flex flex-col justify-between sm:flex-row'>
                <h2 className='text-3xl font-semibold text-slate-200'>Daftar Mutasi</h2>
                <div className='mt-6 flex flex-col gap-3 sm:flex-row md:flex-row sm:mt-4 md:mt-4 lg:mt-0'>
                    <AddButton onClick={() => setOpenModal(true)}>Tambah Mutasi</AddButton>
                    <input
                        type='month'
                        className='px-4 py-2 outline-none bg-slate-600 text-slate-200 rounded-md focus:ring-2 focus:ring-slate-400 transition-all sm:mt-0'
                        value={bulan}
                        onChange={(ev) => setBulan(ev.target.value)}
                    />
                </div>
            </div>
            <h3 className='mt-4 text-xl text-slate-500 sm:mt-0'>Jumlah data : {record}</h3>
            <hr className='my-6 border-2 border-slate-600 bg-none' />
            <div className='bg-slate-700 text-[10px] p-4 rounded-lg shadow-lg sm:p-8 sm:text-base'>
                <table className='w-full text-slate-200'>
                    <thead>
                        <tr>
                            <th className='w-16 uppercase'>No.</th>
                            <th className='w-36 p-2 uppercase'>Nama Anggota</th>
                            <th className='w-56 p-2 uppercase'>Asal Instansi</th>
                            <th className='w-56 p-2 uppercase'>Tujuan Instansi</th>
                            <th className='w-56 p-2 uppercase'>Bulan Mutasi</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-800'>
                        {mutData.length === 0 ? (
                            <tr>
                                <td colSpan={5} className='text-center font-semibold'>
                                    Data Tidak Ditemukan
                                </td>
                            </tr>
                        ) : (
                            mutData &&
                            mutData.map((item, index) => {
                                return (
                                    <tr key={index} className='hover:bg-slate-600 transition-all duration-100'>
                                        <td className='text-center py-2'>{++index}</td>
                                        <td className='w-56'>{item.no_rek.nama_anggota}</td>
                                        <td className=''>{item.dari.nama_ins}</td>
                                        <td className=''>{item.ke.nama_ins}</td>
                                        <td className=''>{item.bulan}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
            {openModal && <AddMutationModal setOpenModal={setOpenModal} agencyName={agencyName} />}
        </Layout>
    );
}
