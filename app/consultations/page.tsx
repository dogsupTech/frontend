'use client'

import { useEffect, useState } from 'react';
import { useAuth } from "@/components/auth/auth";
import ConsultationTable from "@/components/consultationTable"; // Ensure this path is correct

export default function ConsultationPage() {
	const { idToken, isLoading } = useAuth();

	return (
		<div className="w-full p-4">
			<h1 className="text-2xl font-bold mb-4">Consultations</h1>
			<ConsultationTable
				idToken={idToken}
				isLoading={isLoading}
			/>
		</div>
	);
}
