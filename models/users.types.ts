export interface IUser {
    username: string;
    password: string;
    type: 'admin' | 'user';
}

export interface IUsers {
    profiles: IUser[];
}

export interface JwtPayload {
    username?: string;
}

export function isTypeOfUser(user : IUser){
	return (
		typeof user.username === 'string' &&
		typeof user.password === 'string' &&
		typeof user.type === 'string'
	);	
}