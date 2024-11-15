interface SearchMutationDatabyMonthServiceProps {
    bulan: string;
}

interface AddNewMutationDataServiceProps {
    mutationData: any | any[];
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const SearchMutationDatabyMonthService = async ({ bulan }: SearchMutationDatabyMonthServiceProps) => {
    const { token } = JSON.parse(localStorage.getItem('AUTH_DATA') as string);

    const response = await fetch(`${BASE_URL}/api/mutation?bulan=${bulan}`, {
        method: 'GET',
        headers: {
            authorization: token,
        },
    });

    const { data, refreshToken } = await response.json();
    return { data, refreshToken, response };
};

export const AddNewMutationDataService = async ({ mutationData }: AddNewMutationDataServiceProps) => {
    const { token } = JSON.parse(localStorage.getItem('AUTH_DATA') as string);

    const response = await fetch(`${BASE_URL}/api/mutation`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            authorization: token,
        },
        body: JSON.stringify({ mutationData }),
    });
    const { data } = await response.json();
    return { response, data };
};
