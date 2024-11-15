import { ChangeEvent, useEffect, useState } from 'react';
import useFlashHook from '../../hooks/useFlashHook';
import { UpdateMemberService } from '../../services/member-service';
import { MemberType } from '../../types';
import CloseButton from '../buttons/closeButton';
import FlashMessage from '../flash/FlashMessage';

interface EditMemberModalType {
    isOpen: boolean;
    setIsOpen: Function;
    member: MemberType | undefined;
}

const EditMemberModal = ({ isOpen, setIsOpen, member }: EditMemberModalType) => {
    const [memberData, setMemberData] = useState<MemberType | undefined>();
    const flash = useFlashHook({ message: '' });

    useEffect(() => {
        setMemberData(member);
    }, [member]);

    const handleOnChangeNoRek = (ev: ChangeEvent<HTMLInputElement>) => {
        setMemberData((prev): MemberType => {
            return { ...prev, no_rek: ev.target.value.toString().substring(0, 10) } as MemberType;
        });
    };

    const handleOnChangeNamaAnggota = (ev: ChangeEvent<HTMLInputElement>) => {
        setMemberData((prev): MemberType => {
            return { ...prev, nama_anggota: ev.target.value.toUpperCase() } as MemberType;
        });
    };

    const handleOnChangeInstansi = (ev: ChangeEvent<HTMLInputElement>) => {
        let selectedEl: Element | null;
        if (ev.target.value) {
            selectedEl = document.querySelector(`option[value="${ev?.target?.value}"]`);
        }

        setMemberData((prev): MemberType => {
            return { ...prev, detail_ins: { ...prev?.detail_ins, nama_ins: ev.target.value }, kode_ins: selectedEl?.getAttribute('data-code') } as MemberType;
        });
    };

    const handleOnClickSubmit = async () => {
        const finalData = { _id: memberData?._id, no_rek: memberData?.no_rek, kode_ins: memberData?.kode_ins, nama_anggota: memberData?.nama_anggota };
        const { response, msg } = await UpdateMemberService({ data: finalData });
        if (response.status === 200) {
            setIsOpen(false);
            flash.setStatus('success');
            flash.setMsg(msg);
            flash.setIsOpen(true);
        } else {
            flash.setStatus('failed');
            flash.setMsg(msg);
            flash.setIsOpen(true);
        }
    };

    return (
        <>
            {isOpen && <div className='h-screen w-full fixed z-50 top-0 left-0 bg-black opacity-20 transition-all'></div>}
            <div
                className={`w-5/6 bg-slate-800 flex flex-col rounded-lg p-8 fixed z-50 shadow-xl top-10 left-1/2 -translate-x-1/2 transition-all md:w-2/4 lg:w-2/5 duration-150 ${
                    isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
                }`}
            >
                <div className='flex justify-between items-center'>
                    <h3 className='text-2xl text-white font-semibold'>Edit Anggota</h3>
                    <CloseButton onClick={() => setIsOpen(false)} />
                </div>
                <hr className='my-4 border-2 border-slate-600 bg-slate-600 rounded-full' />
                <div className='flex flex-col mt-4'>
                    <label htmlFor='no_rek' className='text-xl text-slate-200 mb-2'>
                        Nomor Rekening
                    </label>
                    <input
                        type='text'
                        name='no_rek'
                        id='no_rek'
                        className='px-4 py-2 bg-slate-600 text-slate-200 rounded-md outline-none focus:ring-2 focus:ring-slate-500 transition-all'
                        value={memberData?.no_rek}
                        onChange={(ev) => handleOnChangeNoRek(ev)}
                    />
                </div>
                <div className='flex flex-col mt-4'>
                    <label htmlFor='nama_anggota' className='text-xl text-slate-200 mb-2'>
                        Nama Anggota
                    </label>
                    <input
                        type='text'
                        name='nama_anggota'
                        id='nama_anggota'
                        className='px-4 py-2 bg-slate-600 text-slate-200 rounded-md outline-none focus:ring-2 focus:ring-slate-500 transition-all'
                        value={memberData?.nama_anggota}
                        onChange={(ev) => handleOnChangeNamaAnggota(ev)}
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
                        value={memberData?.detail_ins?.nama_ins}
                        onChange={(ev) => handleOnChangeInstansi(ev)}
                    />
                </div>
                <div className='my-4'></div>
                <button
                    onClick={handleOnClickSubmit}
                    className='px-6 py-2 bg-teal-600 text-lg text-slate-200 rounded-md hover:bg-teal-800 transition-all duration-300 self-end'
                >
                    Update
                </button>
            </div>
            <FlashMessage {...flash} />
        </>
    );
};

export default EditMemberModal;
