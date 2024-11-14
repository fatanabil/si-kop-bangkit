import { useEffect, useState } from 'react';
import { FlashStatusType } from '../types';

const useFlashHook = ({ message }: { message?: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [msg, setMsg] = useState(message);
    const [status, setStatus] = useState<FlashStatusType>('success');

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                setIsOpen(false);
            }, 4000);
        }
    }, [isOpen]);

    return { isOpen, setIsOpen, msg, setMsg, status, setStatus };
};

export default useFlashHook;
