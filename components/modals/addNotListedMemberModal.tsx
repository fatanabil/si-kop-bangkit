import { ChangeEvent, useEffect, useState } from 'react';
import { AddNewMemberFromInvoiceService } from '../../services/invoice-service';
import { AgencyType, InvoiceNotListedDataType } from '../../types';

interface AddNotListedMemberModalProps {
    agencyData: AgencyType[];
    addMemberOpen: boolean;
    setAddMemberOpen: Function;
    notListedData: InvoiceNotListedDataType[];
    doRefresh: Function;
}

export default function AddNotListedMemberModal({ agencyData, addMemberOpen, setAddMemberOpen, notListedData, doRefresh }: AddNotListedMemberModalProps) {
    const [newMember, setNewMember] = useState<InvoiceNotListedDataType[]>(() =>
        notListedData.map((data) => {
            return { ...data, kode_ins: '' };
        })
    );

    const onChangeAgencyID = (ev: ChangeEvent<HTMLInputElement>, no_rek: string) => {
        const newState = newMember.map((el) => {
            if (el.no_rek === no_rek) {
                return {
                    ...el,
                    kode_ins: ev.target.value,
                };
            }

            return el;
        });
        setNewMember(newState);
    };

    const onDeleteRow = (index: number) => {
        newMember.splice(index, 1);
        setNewMember([...newMember]);
    };

    const onUploadMember = async () => {
        const memberData = newMember
            .filter((data) => data.kode_ins !== '')
            .map((data) => {
                const kd_ins = agencyData.filter((ag) => ag.nama_ins === data.kode_ins)[0].kode_ins;
                return { ...data, kode_ins: kd_ins };
            });
        const { response } = await AddNewMemberFromInvoiceService({ memberData });
        if (response.ok) {
            setAddMemberOpen(false);
            doRefresh();
        }
    };

    useEffect(() => {
        if (addMemberOpen) {
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [addMemberOpen]);

    return (
        <>
            <div className='h-screen w-full absolute z-50 top-0 left-0 bg-black opacity-20 transition-all'></div>
            <div className='w-5/6 h-5/6 absolute z-50 top-10 left-1/2 -translate-x-1/2 bg-slate-700 p-8 rounded-lg shadow-lg flex flex-col overflow-auto'>
                <h1 className='text-white text-xl font-semibold'>Tambah Semua Anggota Baru</h1>
                <hr className='my-6 border-2 border-slate-600 bg-none' />
                <table className='text-white'>
                    <thead>
                        <tr>
                            <th>No Rek</th>
                            <th>Nama Anggota</th>
                            <th>Instansi</th>
                            <th>Hapus</th>
                        </tr>
                    </thead>
                    <tbody>
                        {newMember.map((member, i) => {
                            return (
                                <tr key={i}>
                                    <td>{member.no_rek}</td>
                                    <td>{member.nama_anggota}</td>
                                    <td className='w-1/4'>
                                        <input
                                            inlist='select'
                                            list='agency-name'
                                            className={`w-full my-1 px-4 py-1 bg-slate-600 text-slate-200 rounded-md outline-none focus:ring-2 focus:ring-slate-500 transition-all`}
                                            value={member.kode_ins}
                                            onChange={(ev: ChangeEvent<HTMLInputElement>) => onChangeAgencyID(ev, member.no_rek)}
                                        />
                                    </td>
                                    <td className='text-center'>
                                        <button className='px-4 py-1 bg-red-500 rounded-md' onClick={() => onDeleteRow(i)}>
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <button className='mt-4 px-4 py-2 bg-teal-600 rounded-md text-white hover:bg-teal-500' onClick={onUploadMember}>
                    Tambah Data
                </button>
                <button className='mt-4 px-4 py-2 bg-slate-500 rounded-md text-white hover:bg-slate-400' onClick={() => setAddMemberOpen(false)}>
                    Tutup
                </button>
                <datalist id='agency-name'>
                    {agencyData &&
                        agencyData.map((itm, i) => {
                            return (
                                <option value={itm.nama_ins} key={i}>
                                    {itm.nama_ins}
                                </option>
                            );
                        })}
                </datalist>
            </div>
        </>
    );
}
