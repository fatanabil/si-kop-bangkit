interface SearchAgencyByNameProps {
    nama_instansi: string;
}

interface AddNewAgencyServiceProps {
    kode_ins: string;
    nama_ins: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const GetAgencyDataService = async () => {
    const { token } = JSON.parse(localStorage.getItem('AUTH_DATA') as string);

    const response = await fetch(`${BASE_URL}/api/agency`, {
        method: 'GET',
        headers: {
            authorization: token,
        },
    });
    const { data, refreshToken } = await response.json();
    return { data, response, refreshToken };
};

export const SearchAgencyByNameService = async ({ nama_instansi }: SearchAgencyByNameProps) => {
    const { token } = JSON.parse(localStorage.getItem('AUTH_DATA') as string);

    const response = await fetch(`${BASE_URL}/api/agency?nama_ins=${nama_instansi}`, {
        headers: {
            authorization: token,
        },
    });
    const { data, refreshToken } = await response.json();
    return { response, data, refreshToken };
};

export const AddNewAgencyService = async ({ kode_ins, nama_ins }: AddNewAgencyServiceProps) => {
    const { token } = JSON.parse(localStorage.getItem('AUTH_DATA') as string);

    const response = await fetch(`${BASE_URL}/api/agency`, {
        method: 'POST',
        body: JSON.stringify({ kode_ins, nama_ins }),
        headers: {
            'Content-Type': 'application/json',
            authorization: token,
        },
    });
    const result = await response.json();
    return { result, response };
};
