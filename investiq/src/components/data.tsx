interface User {
    username?: string;
    password?: string | number;
    email?: string;
    user_id?: string;
}

interface Row {
    date: string;
    description: string | number;
    categorie: string;
    sum: number;
    user_id: string;
    type?: string
}

interface RowIdentity {
    user_id: string | number;
    row_id: string | number;
}

export const fetchData = async (inf) => {
    try {
        const response = await fetch('/api/data', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(inf)
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

export const postUserBalance = async (balance) => {
    try {
        const response = await fetch('/api/putBalance', {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(balance)
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

export const postRow = async (row: Row) => {
    try {
        const response = await fetch('/api/postRow', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(row)
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

export const getUserBalance = async (user: User) => {
    try {
        const response = await fetch('/api/idb', {
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

export const deleteRow = async (info: RowIdentity) => {
    try {
        const response = await fetch(`/api/delete/${info.user_id}/${info.row_id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`API error! Status: ${response.status}`);
        }
    } catch (err) {
        if (err instanceof Error) {
            throw new Error(`Data error Status: ${err.message}`, { cause: err });
        }
        throw new Error('Data error Status: unknown error', { cause: err });
    }
};