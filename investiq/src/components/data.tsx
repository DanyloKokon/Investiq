interface User {
    username?: string;
    password: string | number;
    email: string;
    user_id?: number;
}

export const fetchItems = async () => {
    try {
        const response = await fetch('/api/');
        if (!response.ok) {
            throw new Error(`Data error Status: ${response.status}`);
        }
        return await response.json();
    } catch (err) {
        if (err instanceof Error) {
            throw new Error(`Data error Status: ${err.message}`);
        }
        throw new Error('Data error Status: unknown error');
    }
};

export const postUser = async (newUser: User) => {
    try {
        const response = await fetch('/api/addUser', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(newUser)
        });
        if (!response.ok) {
            throw new Error(`API error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (err) {
        if (err instanceof Error) {
            throw new Error(`Data error Status: ${err.message}`);
        }
        throw new Error('Data error Status: unknown error');
    }
};

export const getUser = async (user: User) => {
    try {
        const response = await fetch('/api/id', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(user)
        });
        if (!response.ok) {
            throw new Error(`API error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (err) {
        if (err instanceof Error) {
            throw new Error(`Data error Status: ${err.message}`);
        }
        throw new Error('Data error Status: unknown error');
    }
};