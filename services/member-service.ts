import Router from 'next/router';
import { MemberType } from '../types';

interface AddNewMemberProps {
    no_rek: string;
    nama_anggota: string;
    nama_instansi: string;
}

interface UpdateMemberProps {
    data: {
        _id?: string;
        no_rek?: string;
        nama_anggota?: string;
        kode_instansi?: string;
    };
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const SearchMemberByNameAndAgencyService = async (nama_anggota: string, instansi: string) => {
    const { username, token, isAuthenticated } = JSON.parse(localStorage.getItem('AUTH_DATA') as string);

    const response = await fetch(`${BASE_URL}/api/member?nama=${nama_anggota}&instansi=${instansi}&limit=20`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            authorization: token,
        },
    });
    const { data, refreshToken } = await response.json();
    if (response.ok) {
        if (refreshToken) {
            localStorage.setItem('AUTH_DATA', JSON.stringify({ username, token: refreshToken, isAuthenticated }));
        }
    } else {
        if (response.status === 401) {
            localStorage.setItem('AUTH_DATA', JSON.stringify({ username: '', token: '', isAuthenticated: false }));
            Router.push('/login');
        }
    }
    return { data, response };
};

export const AddNewMemberService = async ({ no_rek, nama_anggota, nama_instansi }: AddNewMemberProps) => {
    const { token } = JSON.parse(localStorage.getItem('AUTH_DATA') as string);

    const response = await fetch(`${BASE_URL}/api/member`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            authorization: token,
        },
        body: JSON.stringify({
            no_rek,
            nama_anggota,
            nama_instansi,
        }),
    });
    const { msg } = await response.json();
    return { msg, response };
};

export const UpdateMemberService = async ({ data }: UpdateMemberProps) => {
    const { token } = JSON.parse(localStorage.getItem('AUTH_DATA') as string);

    const response = await fetch(`${BASE_URL}/api/member`, {
        method: 'PUT',
        headers: { authorization: token },
        body: JSON.stringify(data),
    });

    const { msg } = await response.json();
    return { response, msg };
};

export const DeleteMemberService = async (member: MemberType) => {
    const { token } = JSON.parse(localStorage.getItem('AUTH_DATA') as string);

    const response = await fetch(`${BASE_URL}/api/member`, {
        method: 'DELETE',
        headers: { authorization: token },
        body: JSON.stringify(member),
    });
    const { msg, err } = await response.json();

    return { msg, err, response };
};
