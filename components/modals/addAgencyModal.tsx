import { useState } from 'react';
import { AddNewAgencyService } from '../../services/agency-service';
import { ResponseJSONType } from '../../types';
import CloseButton from '../buttons/closeButton';

interface AddAgencyModalProps {
    setOpenAddModal: Function;
    lastId: string;
}

export default function AddAgencyModal({ setOpenAddModal, lastId }: AddAgencyModalProps) {
    const parsedID = parseInt(lastId.substring(lastId.indexOf('S') + 1, lastId.length)) + 1;
    const currID = () => {
        if (parsedID < 100) return `INS0${parsedID}`;
        return `INS${parsedID}`;
    };
    const [nmInstansi, setNmInstansi] = useState('');
    const [response, setResponse] = useState<ResponseJSONType>();

    const handleOnAddInstansi = async () => {
        try {
            const { response, result } = await AddNewAgencyService({ kode_ins: currID(), nama_ins: nmInstansi });
            setResponse(result);
            setOpenAddModal(false);
        } catch (err) {
            setResponse(err as ResponseJSONType);
        } finally {
            setTimeout(() => {
                setResponse({ data: [], msg: '', err: false });
            }, 3000);
        }
    };

    return (
        <div>
            <div className='h-screen w-full fixed z-10 top-0 left-0 bg-black opacity-20 transition-all'></div>
            <div className='w-5/6 bg-slate-800 rounded-lg p-8 fixed z-20 shadow-xl top-10 left-1/2 -translate-x-1/2 transition-all md:w-2/4 lg:w-2/5'>
                <div className='flex flex-col'>
                    <div className='flex justify-between items-center'>
                        <h3 className='text-2xl text-white font-semibold'>Tambah Instansi</h3>
                        <CloseButton onClick={() => setOpenAddModal(false)} />
                    </div>
                    <hr className='my-4 border-2 border-slate-600 bg-slate-600 rounded-full' />
                    <div className='flex flex-col mt-4'>
                        <label htmlFor='kode-ins' className='text-xl text-slate-200 mb-2'>
                            Kode Instansi
                        </label>
                        <input
                            type='text'
                            name='kode-ins'
                            id='kode-ins'
                            className='px-4 py-2 bg-slate-600 text-slate-200 rounded-md outline-none focus:ring-2 focus:ring-slate-500 transition-all'
                            value={currID()}
                            disabled={true}
                        />
                    </div>
                    <div className='flex flex-col mt-4'>
                        <label htmlFor='nama-ins' className={`text-xl ${response?.err ? 'text-red-400' : 'text-slate-200'} mb-2`}>
                            Nama Instansi
                        </label>
                        <input
                            type='text'
                            name='nama-ins'
                            id='nama-ins'
                            className={`px-4 py-2 bg-slate-600 rounded-md outline-none focus:ring-2 transition-all ${
                                response?.err ? 'text-red-400 focus:ring-red-400' : 'text-slate-200 focus:ring-slate-500'
                            }`}
                            onChange={(ev) => setNmInstansi(ev.target.value.toUpperCase())}
                            value={nmInstansi}
                            autoFocus={true}
                        />
                    </div>
                    {response?.err && <p className='text-red-400 mt-4'>* {response.msg}</p>}
                    <div className='my-4'></div>
                    <button
                        className='px-6 py-2 bg-teal-600 text-lg text-slate-200 rounded-md hover:bg-teal-800 transition-all duration-300 self-end'
                        onClick={handleOnAddInstansi}
                    >
                        Tambah
                    </button>
                </div>
            </div>
        </div>
    );
}
