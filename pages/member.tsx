import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import ActionOptionPopup from '../components/ActionOptionPopup';
import OnDeleteMemberAlert from '../components/alerts/onDeleteMemberAlert';
import AddButton from '../components/buttons/addButton';
import Layout from '../components/layout';
import Loader from '../components/loader';
import AddMemberModal from '../components/modals/addMemberModal';
import EditMemberModal from '../components/modals/editMemberModal';
import AuthContext from '../contexts/authContext';
import ElipsisVerticalIcon from '../icons/ElipsisVerticalIcon';
import { GetAgencyDataService } from '../services/agency-service';
import { SearchMemberByNameAndAgencyService } from '../services/member-service';
import { AgencyType, MemberType } from '../types';

export default function Member() {
    const router = useRouter();
    const { authData, changeAuthData } = useContext(AuthContext);
    const [memberData, setMemberData] = useState<MemberType[]>([]);
    const [agencyData, setAgencyData] = useState<AgencyType[]>([]);
    const [nmAnggota, setNmAnggota] = useState<string>('');
    const [nmInstansi, setNmInstansi] = useState<string>('');
    const [aggDe] = useDebounce(nmAnggota, 500);
    const [insDe] = useDebounce(nmInstansi, 500);
    const [addOpen, setAddOpen] = useState<boolean>(false);
    const [openOption, setOpenOption] = useState({ status: false, id: '' });
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [editedMember, setEditedMember] = useState<MemberType | undefined>();
    const [deleteMemberAlertData, setDeleteMemberAlertData] = useState({ isOpen: false, data: {}, title: '', message: '' });
    const [isLoading, setIsloading] = useState(false);

    const setSearchParam = (param: string, value: string) => {
        const newQuery = { ...router.query, [param]: value };

        router.push({
            pathname: router.pathname,
            query: newQuery,
        });
    };

    const convertQueryToRecord = (query: ParsedUrlQuery): Record<string, string> => {
        const result: Record<string, string> = {};
        Object.keys(query).forEach((key) => {
            const value = query[key];
            if (typeof value === 'string') {
                result[key] = value;
            } else if (Array.isArray(value)) {
                result[key] = value[0] || '';
            }
        });
        return result;
    };

    const removeSearchParam = (param: string) => {
        const searchParam = new URLSearchParams(convertQueryToRecord(router.query));
        searchParam.delete(param);

        router.push({
            pathname: router.pathname,
            query: Object.fromEntries(searchParam),
        });
    };

    const onSearchMemberDataHandler = async (nama_anggota: string, instansi: string) => {
        setIsloading(true);
        const { data, refreshToken, response } = await SearchMemberByNameAndAgencyService(nama_anggota, instansi);

        if (response.ok) {
            if (refreshToken) {
                changeAuthData({ ...authData, token: refreshToken });
            }
            setMemberData(data);
            setIsloading(false);
        } else {
            if (response.status === 401) {
                changeAuthData({ username: '', token: '', isAuthenticated: false });
                return router.replace('/login');
            }
        }
    };

    const handleOnclickOption = (id: string) => {
        setOpenOption((prev) => {
            return { status: !prev.status, id };
        });
    };

    const handleOnClickEditMember = (member: MemberType) => {
        setIsEditModalOpen(!isEditModalOpen);
        setEditedMember(member);
    };

    const handleOnClickDeleteMember = async (member: MemberType) => {
        setDeleteMemberAlertData((prev) => {
            return {
                ...prev,
                isOpen: true,
                data: member,
                title: 'Konfirmasi Hapus Anggota',
                message: `Apakah Anda ingin manghapus anggota: ${member.nama_anggota}?`,
            };
        });
    };

    const handleOnChangeSearchNamaAnggota = (ev: ChangeEvent<HTMLInputElement>) => {
        if (ev.target.value === '') {
            removeSearchParam('nama');
        }
        setNmAnggota(ev.target.value.toUpperCase());
        setSearchParam('nama', ev.target.value.toUpperCase());
    };

    const handleOnChangeSearchInstansi = (ev: ChangeEvent<HTMLInputElement>) => {
        setNmInstansi(ev.target.value.toUpperCase());
    };

    useEffect(() => {
        onSearchMemberDataHandler(aggDe, insDe);
    }, [aggDe, insDe]);

    useEffect(() => {
        const getAgencyData = async () => {
            const { data, response } = await GetAgencyDataService();
            if (response.ok) {
                setAgencyData(data);
            }
        };

        getAgencyData();
    }, []);

    return (
        <Layout title='SI-KOP-BANGKIT | Anggota'>
            <div className='flex flex-col justify-between md:flex-row'>
                <h2 className='text-3xl font-semibold text-slate-200'>Daftar Anggota</h2>
                <div className='mt-6 flex flex-col gap-3 sm:flex-row md:flex-row sm:mt-4 md:mt-4 lg:mt-0'>
                    <AddButton onClick={() => setAddOpen(!addOpen)}>Tambah Anggota</AddButton>
                    <input
                        type='text'
                        placeholder='Cari Nama Anggota'
                        className='w-full px-4 py-2 rounded-md bg-slate-600 shadow-md shadow-slate-800 text-slate-200 outline-none focus:ring-2 focus:ring-slate-500 transition-all sm:mt-0 sm:w-56'
                        onChange={(ev) => handleOnChangeSearchNamaAnggota(ev)}
                        value={nmAnggota}
                    />
                    <input
                        inlist='select'
                        list='agency-name'
                        placeholder='Cari berdasarkan instansi'
                        className='ml-0 w-full px-4 py-2 rounded-md bg-slate-600 shadow-md shadow-slate-800 text-slate-200 outline-none focus:ring-2 focus:ring-slate-500 transition-all sm:mt-0 sm:w-64'
                        onChange={(ev) => handleOnChangeSearchInstansi(ev)}
                        value={nmInstansi}
                    />
                </div>
                <datalist id='agency-name'>
                    {agencyData &&
                        agencyData.map((agency) => (
                            <option key={agency._id} value={agency.nama_ins} data-code={agency.kode_ins}>
                                {agency.nama_ins}
                            </option>
                        ))}
                </datalist>
            </div>
            <hr className='my-8 border-2 border-slate-600 bg-none' />
            <div className='bg-slate-700 text-xs p-4 rounded-lg shadow-lg sm:p-8 sm:text-base'>
                <table className='w-full text-slate-200'>
                    <thead>
                        <tr>
                            <th className='w-8 uppercase'>No.</th>
                            <th className='w-36 p-2 uppercase'>No Rek</th>
                            <th className='w-80 p-2 uppercase'>Nama</th>
                            <th className='w-56 p-2 uppercase'>Instansi</th>
                            <th className='w-8 uppercase'>Aksi</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-800'>
                        {isLoading ? (
                            <tr>
                                <td colSpan={5}>
                                    <div className='flex justify-center w-full py-6'>
                                        <Loader />
                                    </div>
                                </td>
                            </tr>
                        ) : memberData.length === 0 ? (
                            <tr>
                                <td colSpan={4} className='text-center font-semibold'>
                                    Data Tidak Ditemukan
                                </td>
                            </tr>
                        ) : (
                            memberData.map((member, index) => {
                                return (
                                    <tr key={member._id} className='hover:bg-slate-600 transition-all duration-100'>
                                        <td className='text-center py-2'>{++index}</td>
                                        <td className='text-center'>{`${member.no_rek}`}</td>
                                        <td className=''>{member.nama_anggota}</td>
                                        <td className=''>{member.detail_ins.nama_ins}</td>
                                        <td className='text-center relative'>
                                            <button
                                                className='h-6 aspect-square bg-transparent rounded-sm hover:bg-slate-500 relative'
                                                onClick={() => handleOnclickOption(member._id)}
                                            >
                                                <ElipsisVerticalIcon className='size-6' />
                                            </button>
                                            <ActionOptionPopup
                                                openOption={openOption}
                                                setOpenOption={setOpenOption}
                                                member={member}
                                                handleOnDelete={handleOnClickDeleteMember}
                                                handleOnEdit={handleOnClickEditMember}
                                            />
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
            <AddMemberModal addOpen={addOpen} setAddOpen={setAddOpen} />
            <EditMemberModal isOpen={isEditModalOpen} setIsOpen={setIsEditModalOpen} member={editedMember} />
            <OnDeleteMemberAlert alert={{ alertData: deleteMemberAlertData, setAlertData: setDeleteMemberAlertData }} />
        </Layout>
    );
}
