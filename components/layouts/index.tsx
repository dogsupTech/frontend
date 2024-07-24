"use client";

import React from 'react';
import { getAuth } from 'firebase/auth';
import { app } from '@/components/auth/firebase';
import { LoginForm } from "@/components/Login";
import { useAuth } from "@/components/auth/auth";
import Sidebar from "@/components/nav";

const BaseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { userData, isLoading } = useAuth();

	if (isLoading) {
		return <p>Loading...</p>; // Display a loading message or spinner while checking auth status
	}

	return userData ? (
		<div className="flex">
			<Sidebar />
			<main className="flex-1 p-4">
				{children}
			</main>
		</div>
	) : (
		<LoginForm />
	);
};

export default BaseLayout;
