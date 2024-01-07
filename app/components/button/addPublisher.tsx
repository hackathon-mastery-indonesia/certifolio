import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { FaWallet } from 'react-icons/fa';

export default function AddPublisher() {
    const konteks = useContext(AuthContext);
    const [username, setUsername] = useState(""); // State variable for username

    const handleLogin = async () => {
        const contract = konteks?.contract;
        await contract?.addPublisher(username);
        // Additional logic after adding publisher (if needed)
        console.log("Added publisher: " + username);
    };

    const handleInputChange = (event : any) => {
        setUsername(event.target.value); // Update state on input change
    };

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                    Username
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="username"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={handleInputChange}
                />
            </div>
            <button onClick={handleLogin} className="bg-white w-full justify-center flex items-center text-blue-900 font-bold rounded-md px-4 py-3 hover:bg-indigo-300 transition duration-300">
                <FaWallet size={24} />
                <h1 className='ml-3'>add as sudo</h1>
            </button>
        </form>
    );
}
