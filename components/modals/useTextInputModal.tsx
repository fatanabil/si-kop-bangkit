import { useState } from 'react';
import { CheckInvoiceService } from '../../services/invoice-service';
import CloseButton from '../buttons/closeButton';
import Loader from '../loader';

interface UseTextInputModalProps {
    setOpenInputText: Function;
    setListedData: Function;
    setNotListedData: Function;
    setNotListedModalOpen: Function;
}

export default function UseTextInputModal({ setOpenInputText, setListedData, setNotListedData, setNotListedModalOpen }: UseTextInputModalProps) {
    const [loading, setLoading] = useState(false);
    const [dataText, setDataText] = useState('');

    const onUploadHandle = async () => {
        try {
            setLoading(true);
            let parsedData = dataText.split('\n').filter(Boolean);
            const invoiceData = parsedData.map((dt) => {
                const row = dt.split('\t');
                return {
                    no_rek: row[0].length <= 10 ? `${'0'.repeat(10 - row[0].length)}${row[0]}` : row[0],
                    nama_anggota: row[1],
                    jumlah: parseInt(row[2].replaceAll('.', '')),
                };
            });
            localStorage.setItem('SERIALIZED_DATA', JSON.stringify(invoiceData));
            const { response, data } = await CheckInvoiceService({ invoiceData });
            if (response.ok) {
                const { listedData, notListedData } = data;
                setListedData(listedData);
                setNotListedData(notListedData);
                localStorage.setItem('LISTED_DATA', JSON.stringify(listedData));
                localStorage.setItem('NOT_LISTED_DATA', JSON.stringify(notListedData));
                setOpenInputText(false);
                setNotListedModalOpen(true);
            }
        } catch (err) {
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className='h-screen w-full absolute z-50 top-0 left-0 bg-black opacity-20 transition-all'></div>
            <div className='w-5/6 absolute z-50 top-10 left-1/2 -translate-x-1/2 bg-slate-700 p-8 rounded-lg shadow-lg flex flex-col overflow-auto'>
                <div className='flex justify-between'>
                    <h1 className='text-white text-xl font-semibold'>Input text</h1>
                    <CloseButton onClick={() => setOpenInputText(false)} />
                </div>
                <h3 className='text-slate-400 mb-4'>Format input : no_rek[tab]nama[tab]jumlah</h3>
                {/* {isFailed && (
                <Flash
                    status={false}
                    msg="Format Teks tidak sesuai"
                    duration={3000}
                />
                )} */}
                <hr className='my-4 border-2 border-slate-600' />
                <textarea name='' id='' cols={30} rows={15} className='bg-slate-600 mb-4 text-white p-4' onChange={(e) => setDataText(e.target.value)}></textarea>
                <button className='px-4 py-2 bg-teal-600 rounded-md text-white hover:bg-teal-500 flex justify-center items-center' onClick={onUploadHandle}>
                    {loading ? <Loader /> : 'Upload'}
                </button>
            </div>
        </div>
    );
}
