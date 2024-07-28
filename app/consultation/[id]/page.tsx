"use client";

import { Button, Modal, Input } from 'antd';
import { useParams } from 'next/navigation';
import { useAuth } from "@/components/auth/auth";
import React, { useEffect, useState } from "react";
import { WhiteSpace } from "@/components";
import LoadingDots from "@/components/LoadingDots";

export type Consultation = {
	id: string;
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

const fieldTranslations: { [key: string]: string } = {
	'clinical_notes.assessment': "Bedömning",
	'clinical_notes.objective_observations': "Objektiva observationer",
	'clinical_notes.plan': "Plan",
	'clinical_notes.subjective_observations': "Subjektiva observationer",
	'general_information.anamnesis': "Anamnes",
	'general_information.dietary_habits': "Kostvanor",
	'general_information.medical_history': "Medicinsk historia",
	'general_information.previous_surgeries_or_treatments': "Tidigare operationer eller behandlingar",
	'general_information.vaccination_status': "Vaccinationsstatus",
	'general_information.visit_reason': "Besöksorsak",
	'physical_examination.detailed_examination_notes': "Detaljerade undersökningsanteckningar",
	'physical_examination.general_appearance': "Allmänt utseende",
	'physical_examination.heart_rate': "Hjärtfrekvens",
	'physical_examination.respiratory_rate': "Andningsfrekvens",
	'physical_examination.temperature': "Temperatur",
	'physical_examination.weight': "Vikt"
};

const EditModal = ({visible, onClose, onSave, initialValue, title}: {
	visible: boolean,
	onClose: () => void,
	onSave: (value: string) => void,
	initialValue: string,
	title: string
}) => {
	const [value, setValue] = useState(initialValue);

	useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	const handleSave = () => {
		onSave(value);
		onClose();
	};

	return (
		<Modal
			title={`Edit ${title}`}
			visible={visible}
			onOk={handleSave}
			onCancel={onClose}
		>
			<Input.TextArea value={value} onChange={(e) => setValue(e.target.value)}/>
		</Modal>
	);
};

const setNestedValue = (obj: any, path: string, value: any): any => {
	const keys = path.split('.');
	const lastKey = keys.pop() as string;
	const lastObj = keys.reduce((obj, key) => obj[key] = obj[key] || {}, obj);
	lastObj[lastKey] = value;
	return {...obj};
};

export default function ConsultationPage() {
	const params = useParams();
	const [consultation, setConsultation] = useState<Consultation | null>(null);
	const {idToken, isLoading} = useAuth();
	const [modalState, setModalState] = useState<{ visible: boolean, section: string, value: string }>({
		visible: false,
		section: "",
		value: ""
	});

	useEffect(() => {
		const fetchConsultation = async () => {
			if (!idToken || isLoading) return;

			try {
				const response = await fetch(
					process.env.NEXT_PUBLIC_BACKEND_URL + `/consultations/${params.id}`,
					{
						headers: {
							Authorization: `Bearer ${idToken}`,
						},
					}
				);
				if (response.ok) {
					const data: Consultation = await response.json();
					setConsultation(data);
				} else {
					console.error("Failed to fetch consultation data.");
				}
			} catch (error) {
				console.error("Error fetching consultation data:", error);
			}
		};

		fetchConsultation();
	}, [params.id, idToken, isLoading]);

	const handleEdit = (section: string, value: string) => {
		setModalState({visible: true, section, value});
	};

	const handleSave = async (newValue: string) => {
		if (!consultation) return;

		const updatedConsultation = setNestedValue({...consultation}, `sections.${modalState.section}`, newValue);

		try {
			const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/consultations/${consultation.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${idToken}`,
				},
				body: JSON.stringify(updatedConsultation),
			});

			if (response.ok) {
				setConsultation(updatedConsultation);
			} else {
				console.error("Failed to save consultation.");
			}
		} catch (error) {
			console.error("Error saving consultation:", error);
		}

		setModalState({visible: false, section: "", value: ""});
	};

	if (isLoading || !consultation) {
		return <div className="flex justify-center items-center h-screen">
			<LoadingDots />
		</div>;	}

	const renderSection = (sectionKey: string, sectionData: any) => (
		<div key={sectionKey} className="bg-white p-4 mb-4 rounded shadow flex justify-between">
			<div>
				<h2 className="text-xl font-semibold mb-2">{fieldTranslations[sectionKey]}</h2>
				<p>{sectionData}</p>
			</div>
			<Button type="primary" onClick={() => handleEdit(sectionKey, sectionData)}>
				Edit
			</Button>
		</div>
	);

	return (
		<div className="p-8 bg-[#FCFDFA]">
			<h1 className="text-3xl font-bold mb-6">Konsultation: Resultat</h1>
			<p className="mb-8">Klicka på <span className="text-blue-500">"Edit"</span> för att redigera en sektion och
				spara ändringar.</p>
			<div className="flex justify-between mb-4">
				<div className={"flex flex-row justify-center items-center"}>
					<div className={"bg-[FFF] border-[0.25px] border-black rounded-[8px] p-[8px] "}>
						resultat
					</div>
					<WhiteSpace width={"23px"}/>
					<div>
						samtal
					</div>
				</div>
				<div>
					<label className="block mb-2 font-semibold">Namn på konsultation</label>
					<input className="p-2 border rounded-md" value={consultation?.name} readOnly/>
				</div>
			</div>
			<div className="mb-8">
				<h2 className="text-2xl font-bold mb-4">Allmän information</h2>
				{consultation?.sections?.general_information && Object.entries(consultation.sections.general_information).map(([key, value]) =>
					renderSection(`general_information.${key}`, value)
				)}
			</div>
			<div className="mb-8">
				<h2 className="text-2xl font-bold mb-4">Fysisk undersökning</h2>
				{consultation?.sections?.physical_examination && Object.entries(consultation.sections.physical_examination).map(([key, value]) =>
					renderSection(`physical_examination.${key}`, value)
				)}
			</div>
			<div>
				<h2 className="text-2xl font-bold mb-4">Kliniska anteckningar</h2>
				{consultation?.sections?.clinical_notes && Object.entries(consultation.sections.clinical_notes).map(([key, value]) =>
					renderSection(`clinical_notes.${key}`, value)
				)}
			</div>

			<div className="flex justify-center mt-8">
				<Button type="primary" className="bg-blue-500 text-white font-bold py-2 px-4 rounded">
					KLAR
				</Button>
			</div>

			<EditModal
				visible={modalState.visible}
				onClose={() => setModalState({...modalState, visible: false})}
				onSave={handleSave}
				initialValue={modalState.value}
				title={fieldTranslations[modalState.section] as string || modalState.section.split('.').pop() as string}
			/>
		</div>
	);
}
