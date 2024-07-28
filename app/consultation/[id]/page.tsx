'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/auth";

export type Consultation = {
	id: string,
	date: string;
	full_transcript: string;
	name: string;
	sections: {
		clinical_notes: {
			assessment: string;
			objective_observations: string;
			plan: string;
			subjective_observations: string;
		};
		general_information: {
			anamnesis: string;
			dietary_habits: string;
			medical_history: string;
			previous_surgeries_or_treatments: string;
			vaccination_status: string;
			visit_reason: string;
		};
		physical_examination: {
			detailed_examination_notes: string;
			general_appearance: string;
			heart_rate: string;
			respiratory_rate: string;
			temperature: string;
			weight: string;
		};
	};
};

export default function ConsultationPage() {
	const params = useParams();
	const [consultation, setConsultation] = useState<Consultation | null>(null);
	const { idToken, isLoading } = useAuth();

	useEffect(() => {
		const fetchConsultation = async () => {
			if (!idToken || isLoading) return;

			const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/consultations/${params.id}`, {
				headers: {
					"Authorization": `Bearer ${idToken}`,
				},
			});
			if (response.ok) {
				const data = await response.json();
				setConsultation(data);
			}
		};

		fetchConsultation();
	}, [params.id, idToken, isLoading]);

	if (isLoading || !consultation) {
		return <div className="flex justify-center items-center h-screen">Loading...</div>;
	}

	console.log("Consultation:", consultation);
	return (
		<div className="p-8 bg-gray-100">
			<h1 className="text-2xl font-bold mb-6">Allmän information</h1>
			<div className="bg-white p-4 mb-4 rounded shadow">
				<h2 className="text-xl font-semibold mb-2">Besöksorsak</h2>
				<p>{consultation.sections.general_information.visit_reason}</p>
			</div>
			<div className="bg-white p-4 mb-4 rounded shadow">
				<h2 className="text-xl font-semibold mb-2">Anamnes</h2>
				<p>{consultation.sections.general_information.anamnesis}</p>
			</div>
			<div className="bg-white p-4 mb-4 rounded shadow">
				<h2 className="text-xl font-semibold mb-2">Medicinsk historia</h2>
				<p>{consultation.sections.general_information.medical_history}</p>
			</div>
			<div className="bg-white p-4 mb-4 rounded shadow">
				<h2 className="text-xl font-semibold mb-2">Kostvanor</h2>
				<p>{consultation.sections.general_information.dietary_habits}</p>
			</div>
			<div className="bg-white p-4 mb-4 rounded shadow">
				<h2 className="text-xl font-semibold mb-2">Vaccinationsstatus</h2>
				<p>{consultation.sections.general_information.vaccination_status}</p>
			</div>
			<div className="bg-white p-4 mb-4 rounded shadow">
				<h2 className="text-xl font-semibold mb-2">Tidigare operationer eller behandlingar</h2>
				<p>{consultation.sections.general_information.previous_surgeries_or_treatments}</p>
			</div>

			<h1 className="text-2xl font-bold mb-6 mt-8">Fysisk undersökning</h1>
			<div className="bg-white p-4 mb-4 rounded shadow">
				<h2 className="text-xl font-semibold mb-2">Temperatur</h2>
				<p>{consultation.sections.physical_examination.temperature}</p>
			</div>
			<div className="bg-white p-4 mb-4 rounded shadow">
				<h2 className="text-xl font-semibold mb-2">Hjärtfrekvens</h2>
				<p>{consultation.sections.physical_examination.heart_rate}</p>
			</div>
			<div className="bg-white p-4 mb-4 rounded shadow">
				<h2 className="text-xl font-semibold mb-2">Andningsfrekvens</h2>
				<p>{consultation.sections.physical_examination.respiratory_rate}</p>
			</div>
			<div className="bg-white p-4 mb-4 rounded shadow">
				<h2 className="text-xl font-semibold mb-2">Vikt</h2>
				<p>{consultation.sections.physical_examination.weight}</p>
			</div>
			<div className="bg-white p-4 mb-4 rounded shadow">
				<h2 className="text-xl font-semibold mb-2">Allmänt utseende</h2>
				<p>{consultation.sections.physical_examination.general_appearance}</p>
			</div>
			<div className="bg-white p-4 mb-4 rounded shadow">
				<h2 className="text-xl font-semibold mb-2">Detaljerade undersökningsanteckningar</h2>
				<p>{consultation.sections.physical_examination.detailed_examination_notes}</p>
			</div>

			<h1 className="text-2xl font-bold mb-6 mt-8">Kliniska anteckningar</h1>
			<div className="bg-white p-4 mb-4 rounded shadow">
				<h2 className="text-xl font-semibold mb-2">Subjektiva observationer (t.ex. ägarens beskrivning av symtom)</h2>
				<p>{consultation.sections.clinical_notes.subjective_observations}</p>
			</div>
			<div className="bg-white p-4 mb-4 rounded shadow">
				<h2 className="text-xl font-semibold mb-2">Objektiva observationer (t.ex. kliniska tecken noterade under undersökningen)</h2>
				<p>{consultation.sections.clinical_notes.objective_observations}</p>
			</div>
			<div className="bg-white p-4 mb-4 rounded shadow">
				<h2 className="text-xl font-semibold mb-2">Bedömning</h2>
				<p>{consultation.sections.clinical_notes.assessment}</p>
			</div>
			<div className="bg-white p-4 mb-4 rounded shadow">
				<h2 className="text-xl font-semibold mb-2">Plan (diagnostiska tester, behandlingar, uppföljning)</h2>
				<p>{consultation.sections.clinical_notes.plan}</p>
			</div>

			<div className="flex justify-center mt-8">
				<button className="bg-blue-500 text-white font-bold py-2 px-4 rounded">KLAR</button>
			</div>
		</div>
	);
}
