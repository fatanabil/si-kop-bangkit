import useFlashHook from '../../hooks/useFlashHook';
import { DeleteMemberService } from '../../services/member-service';
import { MemberType } from '../../types';
import FlashMessage from '../flash/FlashMessage';

interface OnDeleteMemberAlertType {
    alert: { alertData: { isOpen: boolean; title: string; message: string; data: MemberType | object }; setAlertData: Function };
}

const OnDeleteMemberAlert = ({ alert: { alertData, setAlertData } }: OnDeleteMemberAlertType) => {
    const flash = useFlashHook({ message: '' });

    const closeAlert = () => {
        setAlertData((prev: any) => {
            return { ...prev, isOpen: false };
        });
    };

    const confirmAlert = async () => {
        const { msg, err, response } = await DeleteMemberService(alertData.data as MemberType);
        setAlertData((prev: any) => {
            return { ...prev, isOpen: false };
        });
        flash.setIsOpen(true);
        flash.setStatus(!err ? 'success' : 'failed');
        flash.setMsg(msg);
    };

    return (
        <>
            <div
                className={`w-5/6 bg-slate-800 flex flex-col rounded-lg p-8 fixed z-50 shadow-xl top-1/2 left-1/2 -translate-x-1/2 transition-all md:w-2/4 lg:w-2/5 duration-150 -translate-y-full ${
                    alertData.isOpen ? 'opacity-100 -translate-y-full' : 'opacity-0 -translate-y-[calc(100%_+_16px)] pointer-events-none'
                }`}
            >
                <h1 className='text-2xl text-white font-semibold'>{alertData.title}</h1>
                <hr className='my-4 border-2 border-slate-600 bg-slate-600 rounded-full' />
                <p className='text-slate-400'>{alertData.message}</p>
                <span className='flex gap-3 mt-6 justify-end'>
                    <button onClick={closeAlert} className='px-6 py-2 bg-slate-600 text-lg text-slate-200 rounded-md hover:bg-slate-700 transition-all duration-300'>
                        Batal
                    </button>
                    <button onClick={confirmAlert} className='px-6 py-2 bg-rose-600 text-lg text-slate-200 rounded-md hover:bg-rose-800 transition-all duration-300'>
                        Hapus
                    </button>
                </span>
            </div>
            <FlashMessage {...flash} />
        </>
    );
};

export default OnDeleteMemberAlert;
