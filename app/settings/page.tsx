"use client"

import React, { useEffect, useState } from 'react';
import { useAuth } from "@/components/auth/auth";
import LoadingDots from "@/components/LoadingDots";

type User = {
	name: string;
	email: string;
	role: string;
};

export default function Users() {
	const {idToken} = useAuth();
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/clinics/users`, {
					headers: {
						Authorization: `Bearer ${idToken}`,
					},
				});

				if (response.ok) {
					const data = await response.json();
					setUsers(data);
				} else {
					setError('Failed to fetch users.');
				}
			} catch (error) {
				setError('An error occurred while fetching users.');
			} finally {
				setLoading(false);
			}
		};

		if (idToken) {
			fetchUsers();
		}
	}, [idToken]);

	if (loading) {
		return <div className="flex justify-center items-center h-screen">
			<LoadingDots/>
		</div>;
	}

	if (error) {
		return <div className="flex justify-center items-center h-screen">{error}</div>;
	}

	return (
		<main className="w-full h-screen flex flex-col items-center justify-start bg-gray-100 p-8">
			<h1 className="text-4xl font-bold mb-2">Användare</h1>
			<p className="text-lg mb-8">Här ser du en överblick över alla tidigare besök du har haft där Charlie har
				använts under konsultationen.</p>
			<div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
				<div className="flex justify-between px-8 py-4 bg-gray-50 border-b">
					<span className="text-lg font-semibold">Namn</span>
					<span className="text-lg font-semibold">Roll</span>
				</div>
				<div>
					{users.map((user, index) => (
						<div
							key={user.email}
							className={`flex justify-between px-8 py-4 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
						>
							<div>
								<p className="font-bold">{user.name}</p>
								<p className="text-gray-600">{user.email}</p>
							</div>
							<span className="text-gray-600">{user.role}</span>
						</div>
					))}
				</div>
			</div>
		</main>
	);
}
