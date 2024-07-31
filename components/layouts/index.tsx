"use client";

import React from 'react';
import { getAuth } from 'firebase/auth';
import { app } from '@/components/auth/firebase';
import { LoginForm } from "@/components/Login";
import { useAuth } from "@/components/auth/auth";
import Sidebar from "@/components/nav";
import LoadingDots from "@/components/LoadingDots";

const BaseLayout: React.FC<{ children: React.ReactNode }> = ({children}) => {
	const {userData, isLoading} = useAuth();

	if (isLoading) {
		return <div className="flex justify-center items-center h-screen">
			<LoadingDots />
		</div>;
	}

	return userData ? (
		<div className="flex w-full">
			<Sidebar/>
			<main className="pl-[310px] w-full">
				{children}
			</main>
		</div>
	) : (
		<div
			style={{backgroundImage: `url("/background-login.jpeg")`, backgroundSize: 'cover'}}
			className="h-screen flex w-full justify-center items-center"
		>
			<LoginForm/>
		</div>
	);
};

export default BaseLayout;
