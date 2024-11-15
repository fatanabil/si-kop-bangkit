import { useRouter } from 'next/router';
import { useState } from 'react';
import { mutate } from 'swr';
import useFlashHook from '../../hooks/useFlashHook';
import { AddNewMemberService, SearchMemberByNameAndAgencyService } from '../../services/member-service';
import CloseButton from '../buttons/closeButton';
import FlashMessage from '../flash/FlashMessage';

interface AddMemberModalProps {
    addOpen: boolean;
    setAddOpen: Function;
}

export default function AddMemberModal({ addOpen, setAddOpen }: AddMemberModalProps) {
    const router = useRouter();
    const [noRek, setNoRek] = useState<string>('0000000000');
    const [nmAnggota, setNmAnggota] = useState<string>('');
    const [nmInstansi, setNmInstansi] = useState<string>('');
    const flash = useFlashHook({ message: '' });

    const onSubmitNewMemberHandler = async () => {
        const { nama = '', instansi = '' } = router.query;
        mutate(`/api/member?nama=${nama}&instansi=${instansi}`, (prev: any) => {
            return { ...prev, data: [...prev?.data, { _id: Date.now(), no_rek: noRek, nama_anggota: nmAnggota, detail_ins: { nama_ins: nmInstansi } }] };
        });

        const { response, msg } = await AddNewMemberService({ no_rek: noRek, nama_anggota: nmAnggota, nama_instansi: nmInstansi });
        if (response.status === 200) {
            setAddOpen(false);
            flash.setMsg(msg);
            flash.setStatus('success');
            flash.setIsOpen(true);
        } else {
            setAddOpen(false);
            flash.setMsg(msg);
            flash.setStatus('failed');
            flash.setIsOpen(true);
        }
        setNoRek('0000000000');
        setNmAnggota('');
        setNmInstansi('');
        mutate(`/api/member?nama=${nama}&instansi=${instansi}`, () => SearchMemberByNameAndAgencyService(nama as string, instansi as string), {
            revalidate: true,
        });
    };

    return (
        <>
            {addOpen && <div className='h-screen w-full fixed z-50 top-0 left-0 bg-black opacity-20 transition-all'></div>}
            <div
                className={`w-5/6 bg-slate-800 rounded-lg p-8 fixed shadow-xl top-1/2 left-1/2 -translate-x-1/2 transition-all md:w-2/4 lg:w-2/5 z-50 ${
                    addOpen ? '-translate-y-1/2 opacity-100' : '-translate-y-[calc(50%_+_16px)] opacity-0 pointer-events-none'
                }`}
            >
                <div className='flex justify-between items-center'>
                    <h3 className='text-2xl text-white font-semibold'>Tambah Anggota</h3>
                    <CloseButton onClick={() => setAddOpen(false)} />
                </div>
                <hr className='my-4 border-2 border-slate-600 bg-slate-600 rounded-full' />
                <div className='flex flex-col'>
                    <div className='flex flex-col mt-4'>
                        <label htmlFor='no-rek' className='text-xl text-slate-200 mb-2'>
                            No Rekening
                        </label>
                        <input
                            type='number'
                            name='no-rek'
                            id='no-rek'
                            className='px-4 py-2 bg-slate-600 text-slate-200 rounded-md outline-none focus:ring-2 focus:ring-slate-500 transition-all'
                            onChange={(ev) => setNoRek(ev.target.value.toString().substring(0, 10))}
                            value={noRek}
                            required={true}
                        />
                    </div>
                    <div className='flex flex-col mt-4'>
                        <label htmlFor='nama-anggota' className='text-xl text-slate-200 mb-2'>
                            Nama Anggota
                        </label>
                        <input
                            type='text'
                            name='nama-anggota'
                            id='nama-anggota'
                            className='px-4 py-2 bg-slate-600 text-slate-200 rounded-md outline-none focus:ring-2 focus:ring-slate-500 transition-all'
                            onChange={(ev) => setNmAnggota(ev.target.value.toUpperCase())}
                            value={nmAnggota}
                            required={true}
                        />
                    </div>
                    <div className='flex flex-col mt-4'>
                        <label htmlFor='nama-instansi' className='text-xl text-slate-200 mb-2'>
                            Instansi
                        </label>
                        <input
                            type='select'
                            name='nama-instansi'
                            list='agency-name'
                            id='nama-instansi'
                            className='px-4 py-2 bg-slate-600 text-slate-200 rounded-md outline-none focus:ring-2 focus:ring-slate-500 transition-all'
                            onChange={(ev) => setNmInstansi(ev.target.value)}
                            value={nmInstansi}
                            required={true}
                        />
                    </div>
                    <div className='my-4'></div>
                    <button
                        onClick={() => onSubmitNewMemberHandler()}
                        className='px-6 py-2 bg-teal-600 text-lg text-slate-200 rounded-md hover:bg-teal-800 transition-all duration-300 self-end'
                    >
                        Tambah
                    </button>
                </div>
            </div>
            <FlashMessage {...flash} />
        </>
    );
}
