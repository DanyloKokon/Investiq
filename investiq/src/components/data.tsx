// import { useState } from "react";
// const [data, setData] = useState(null);
// const [error, setError] = useState(null);

// const connectToBackend = async () => {
//     try {
//         setError(null);
//         // Ensure port 5000 (or your backend port) is used instead of React's port
//         const response = await fetch('/api/');

//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const result = await response.json();
//         setData(result);
//     } catch (err) {
//         console.error(err);
//         setError(err.message);
//     }
// };

// const URl = "/api"

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