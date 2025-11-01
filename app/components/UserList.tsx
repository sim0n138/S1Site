'use client';

import React, { useState, useEffect } from 'react';

interface User {
    id: string;
    email: string;
    name: string | null;
    createdAt: string;
}

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/users');
            if (!res.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, name }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to create user');
            }

            // Clear form and refresh list
            setEmail('');
            setPassword('');
            setName('');
            fetchUsers();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/users/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to delete user');
            }

            // Refresh list
            fetchUsers();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">User Management (CRUD Example)</h1>

            {/* Create User Form */}
            <div className="mb-8 p-6 border rounded-lg shadow-lg bg-white">
                <h2 className="text-2xl font-semibold mb-4">Create New User</h2>
                <form onSubmit={handleCreateUser} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email (required)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    <input
                        type="password"
                        placeholder="Password (required)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Name (optional)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400 transition duration-150"
                    >
                        {loading ? 'Creating...' : 'Create User'}
                    </button>
                </form>
            </div>

            {/* Status Messages */}
            {error && <p className="text-red-500 mb-4 p-3 bg-red-100 border border-red-400 rounded">{error}</p>}
            {loading && !error && <p className="text-blue-500 mb-4 p-3 bg-blue-100 border border-blue-400 rounded">Loading...</p>}

            {/* User List */}
            <div className="p-6 border rounded-lg shadow-lg bg-white">
                <h2 className="text-2xl font-semibold mb-4">Existing Users ({users.length})</h2>
                {users.length === 0 && !loading && !error ? (
                    <p className="text-gray-500">No users found. Create one above!</p>
                ) : (
                    <ul className="space-y-3">
                        {users.map((user) => (
                            <li key={user.id} className="flex justify-between items-center p-3 border-b last:border-b-0">
                                <div>
                                    <p className="font-medium">{user.name || 'No Name'}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                                <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    disabled={loading}
                                    className="bg-red-500 text-white text-sm p-2 rounded hover:bg-red-600 disabled:bg-gray-400 transition duration-150"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default UserList;
