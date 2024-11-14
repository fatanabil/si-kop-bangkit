import { MemberType } from '../types';

export const DeleteMemberService = async (BASE_URL: string, member: MemberType, token: string) => {
    const response = await fetch(`${BASE_URL}/api/member`, {
        method: 'DELETE',
        headers: { authorization: token },
        body: JSON.stringify(member),
    });
    const { msg, err } = await response.json();

    return { msg, err, response };
};
