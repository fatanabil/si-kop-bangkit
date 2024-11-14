import { Ref, useEffect, useRef } from 'react';
import PencilIcon from '../icons/PencilIcon';
import TrashIcon from '../icons/TrashIcon';
import { MemberType } from '../types';

interface ActionOptionPopupType {
    openOption: { status: boolean; id: string };
    setOpenOption: Function;
    member: MemberType;
    handleOnEdit: Function;
    handleOnDelete: Function;
}

const ActionOptionPopup = ({ openOption, setOpenOption, member, handleOnEdit, handleOnDelete }: ActionOptionPopupType) => {
    const ref = useRef<HTMLDivElement | null>(null);

    const handleClickOutside = (ev: MouseEvent) => {
        if (ref.current && !ref.current.contains(ev.target as Node)) {
            setOpenOption({ status: false, id: '' });
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div
            ref={ref}
            className={`flex flex-col bg-slate-500 rounded-md absolute z-10 right-0 transition-all duration-150 origin-top-right divide-y-[1px] divide-slate-400 overflow-hidden shadow-lg ${
                openOption.status && openOption.id === member._id ? 'opacity-100 scale-100' : 'opacity-0 -translate-y-4 scale-90 pointer-events-none'
            }`}
        >
            <button onClick={() => handleOnEdit(member)} className='flex gap-2 items-center cursor-pointer px-5 py-[6px] hover:bg-slate-600 transition-all duration-150'>
                <PencilIcon className='w-4 h-4' />
                <span>Edit</span>
            </button>
            <button
                onClick={() => handleOnDelete(member)}
                className='flex gap-2 items-center cursor-pointer px-5 py-[6px] hover:bg-slate-600 transition-all duration-150 text-rose-500'
            >
                <TrashIcon className='w-4 h-4' />
                <span>Delete</span>
            </button>
        </div>
    );
};

export default ActionOptionPopup;
