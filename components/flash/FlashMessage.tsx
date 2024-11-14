import { useEffect, useState } from 'react';
import { FlashStatusType } from '../../types';

type FlashMessageType = {
    msg: string | undefined;
    status: FlashStatusType;
    isOpen: boolean | undefined;
};

const FlashMessage = ({ msg, status, isOpen }: FlashMessageType) => {
    const colorFlash = {
        success: 'bg-emerald-600',
        failed: 'bg-rose-600',
        warning: 'bg-amber-600',
    };

    return (
        <div
            className={`${colorFlash[status]} fixed p-6 rounded-md max-w-xs w-full overflow-hidden right-8 bottom-8 shadow-md ${
                isOpen ? 'translate-x-0' : 'translate-x-[200%]'
            } transition-all duration-300 ease-in-out`}
        >
            <h1 className='text-white font-semibold relative'>{msg}</h1>
            <div className={`h-[3px] bg-white absolute left-0 bottom-0 ${isOpen ? 'w-full' : 'w-0'} transition-all duration-[3000ms] ease-linear delay-300`}></div>
        </div>
    );
};

export default FlashMessage;
