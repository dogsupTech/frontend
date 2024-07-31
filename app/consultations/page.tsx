'use client'

import React, { useEffect, useState } from 'react';
import { useAuth } from "@/components/auth/auth";
import ConsultationTable from "@/components/consultationTable";
import { WhiteSpace } from "@/components"; // Ensure this path is correct

export default function ConsultationPage() {
	const { idToken, isLoading } = useAuth();

	return (
		<div className="mx-[37px] mt-[91px]">
			<div className={"px-[77px]"}>
				<h1 className="text-[40px]">Konsultationer</h1>
				<WhiteSpace height={"14px"}/>
				<p className={"min-h-[82px] max-w-[507px] font-inter text-[12px]"}>
					Här ser du en överblick över alla tidigare besök du har haft där
					Charlie har använts under konsultationen.
				</p>
			<ConsultationTable
				idToken={idToken}
				isLoading={isLoading}
			/>
			</div>
		</div>
	);
}
