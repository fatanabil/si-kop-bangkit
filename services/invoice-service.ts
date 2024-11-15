import { InvoiceNotListedDataType } from '../types';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface CheckInvoiceServiceProps {
    invoiceData: [] | {};
}

interface AddNewMemberFromInvoiceServiceProps {
    memberData: InvoiceNotListedDataType[];
}

export const CheckInvoiceService = async ({ invoiceData }: CheckInvoiceServiceProps) => {
    const { token } = JSON.parse(localStorage.getItem('AUTH_DATA') as string);

    const response = await fetch(`${BASE_URL}/api/invoice/check`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            authorization: token,
        },
        body: JSON.stringify({ invoiceData }),
    });
    const { data } = await response.json();
    return { data, response };
};

export const AddNewMemberFromInvoiceService = async ({ memberData }: AddNewMemberFromInvoiceServiceProps) => {
    const response = await fetch(`${BASE_URL}/api/invoice/add-member`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberData }),
    });
    const { data } = await response.json();
    return { response };
};
