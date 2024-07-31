"use client";

import { Button, Modal, Input } from 'antd';
import { useParams } from 'next/navigation';
import { useAuth } from "@/components/auth/auth";
import React, { useEffect, useState } from "react";
import { WhiteSpace } from "@/components";
import LoadingDots from "@/components/LoadingDots";
import { Link, Element, Events, animateScroll as scroll, scrollSpy } from 'react-scroll';

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
		// Updating scrollSpy when the component mounts.
		scrollSpy.update();

		// Returning a cleanup function to remove the registered events when the component unmounts.
		return () => {
			Events.scrollEvent.remove('begin');
			Events.scrollEvent.remove('end');
		};
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
	const [view, setView] = useState<"resultat" | "samtal">("resultat");

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
			<LoadingDots/>
		</div>;
	}

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
		<div className="mx-[37px] mt-[91px]">
			<div>
				<h1 className="text-[40px]">Konsultation: {view}</h1>
				<WhiteSpace height={"14px"}/>
				<p className={"min-h-[82px] max-w-[507px] font-inter text-[12px]"}>
					{

						view == "resultat" ?
							<>
								Klicka på &nbsp;
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="13"
									height="15"
									viewBox="0 0 13 15"
									fill="none"
									style={{display: 'inline-block', verticalAlign: 'middle'}}
								>
									<path
										d="M4.58824 12C4.16765 12 3.8076 11.8531 3.50809 11.5594C3.20858 11.2656 3.05882 10.9125 3.05882 10.5V1.5C3.05882 1.0875 3.20858 0.734375 3.50809 0.440625C3.8076 0.146875 4.16765 0 4.58824 0H11.4706C11.8912 0 12.2512 0.146875 12.5507 0.440625C12.8502 0.734375 13 1.0875 13 1.5V10.5C13 10.9125 12.8502 11.2656 12.5507 11.5594C12.2512 11.8531 11.8912 12 11.4706 12H4.58824ZM4.58824 10.5H11.4706V1.5H4.58824V10.5ZM1.52941 15C1.10882 15 0.748775 14.8531 0.449265 14.5594C0.149755 14.2656 0 13.9125 0 13.5V3H1.52941V13.5H9.94118V15H1.52941Z"
										fill="#343437"
									/>
								</svg>
								&nbsp; för att kopiera en anteckning som du sedan kan klistra in i din patients journal.
								För att ändra en anteckning klicka på &nbsp;
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="4"
									height="16"
									viewBox="0 0 4 16"
									fill="none"
									style={{display: 'inline-block', verticalAlign: 'middle'}}
								>
									<circle cx="2" cy="2" r="2" fill="#343437"/>
									<circle cx="2" cy="7.6001" r="2" fill="#343437"/>
									<circle cx="2" cy="13.2" r="2" fill="#343437"/>
								</svg>
								&nbsp; och sedan ‘ändra’. När du känner dig klar, klicka på Klar-knappen längst ner på
								sidan. Du kan närsomhelst titta på resultatet från tidigare konsultationer genom att
								klicka på ‘konsultationer’ i menyn till vänster.
							</>
							: <>
								Nedan finner du hela samtalet i text från er konsultation som AI:n har analyserat. AI:n har
								transkriberat ert samtal, helt enkelt omvandlat tal till text genom att noggrant skriva ner
								allt som sagts under ert samtal.
							</>
					}
				</p>
				<div className="flex justify-between">
					<div className={"flex flex-row justify-center items-center"}>
						<div
							onClick={() => setView("resultat")}
							className={`bg-[FFF] ${view === "resultat" ? "border-[0.25px] border-black bg-white" : ""} rounded-[8px] p-[8px] cursor-pointer`}
						>
							Resultat
						</div>
						<WhiteSpace width={"23px"}/>
						<div
							onClick={() => setView("samtal")}
							className={`${view === "samtal" ? "border-[0.25px] border-black rounded-[8px] p-[8px] bg-white" : ""} cursor-pointer`}
						>
							Samtal
						</div>
					</div>
					<div className={"p-2 border rounded-md bg-white flex flex-col min-w-[280px]"}>
						<label className="text-[10px] font-semibold">Namn på konsultation</label>
						{consultation?.name}
					</div>
				</div>
			</div>
			{/* Navigation Links */}
			<div className={"flex flex-row ml-[8px]"}>
				<Link to="allman-information"
					  className="cursor-pointer hover:underline pr-[12px]">
					<p className={"font-inter text-[12px]"}>
						Allmän information
					</p>
				</Link>
				<Link to="fysisk-undersokning"
					  className="cursor-pointer hover:underline pr-[12px]">
					<p className={"font-inter text-[12px]"}>
						Fysisk undersökning
					</p>
				</Link>
				<Link to="kliniska-anteckningar"
					  className="cursor-pointer hover:underline">
					<p className={"font-inter text-[12px]"}>
						Kliniska anteckningar
					</p>
				</Link>
			</div>


			<WhiteSpace height={"12px"}/>
			{/*result & samtal */}
			<div>
				<div className={"bg-white rounder-[8px] py-[22px] px-[77px]"}>
					{/*RESULT*/}
					{view === "resultat" &&
						<>
							<Element name="allman-information">
								<div className="mb-8">
									<h2 className="text-[26px] mb-4">Allmän information</h2>
									{consultation?.sections?.general_information && Object.entries(consultation.sections.general_information).map(([key, value]) =>
										renderSection(`general_information.${key}`, value)
									)}
								</div>
							</Element>
							<Element name="fysisk-undersokning">
								<div className="mb-8">
									<h2 className="text-[26px] mb-4">Fysisk undersökning</h2>
									{consultation?.sections?.physical_examination && Object.entries(consultation.sections.physical_examination).map(([key, value]) =>
										renderSection(`physical_examination.${key}`, value)
									)}
								</div>
							</Element>
							<Element name="kliniska-anteckningar">
								<div>
									<h2 className="text-[26px] mb-4">Kliniska anteckningar</h2>
									{consultation?.sections?.clinical_notes && Object.entries(consultation.sections.clinical_notes).map(([key, value]) =>
										renderSection(`clinical_notes.${key}`, value)
									)}
								</div>
							</Element>
							<div className="flex justify-center mt-8">
								<Button type="primary" className="bg-blue-500 text-white font-bold py-2 px-4 rounded">
									KLAR
								</Button>
							</div>
						</>
					}
				</div>
				{/*SAMTAL*/}
				<div>
					
				</div>
			</div>
			<EditModal
				visible={modalState.visible}
				onClose={() => setModalState({...modalState, visible: false})}
				onSave={handleSave}
				initialValue={modalState.value}
				title={fieldTranslations[modalState.section] as string || modalState.section.split('.').pop() as string}
			/>
		</div>
	)
		;
}
