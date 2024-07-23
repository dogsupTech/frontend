"use client";

import React, { FormEvent, useEffect, useState } from 'react';
import initTranslations from '../../i18n';
import TranslationsProvider from '@/components/TranslationsProvider';
import { useIsMobile } from "@/useIsMobile";
import { Dog, useAuth } from "@/components/auth/auth";
import { H3, H4, H5, H6, P1, P2, P4 } from "@/components/texts";
import Chat from "@/components/Chat";
import { WhiteSpace } from "@/components";
import { WelcomeAi } from "@/components/auth/welcome";
import { useDropzone } from "react-dropzone";

interface ITranslations {
	t: (key: string) => string;
	resources: Record<string, any>;
}

interface HomeProps {
	params: {
		locale: string;
	};
}

const Loading = () => (
	<div className={"h-screen flex justify-center items-center"}>Loading...</div>
);

const User = () => {
	const { idToken, isLoading } = useAuth();
	const [patientName, setPatientName] = useState<string>('');
	const [patients, setPatients] = useState<any[]>([]);

	const addPatient = async () => {
		if (!patientName) {
			alert('Please provide a patient name.');
			return;
		}

		try {
			const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/new-patient', {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${idToken}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ name: patientName }),
			});

			if (!response.ok) {
				throw new Error('Failed to add patient');
			}

			alert('Patient added successfully.');
			fetchPatients(); // Refresh the list of patients after adding a new one
		} catch (error) {
			console.error('Add Patient Error:', error);
			alert('Failed to add patient');
		}
	};

	const fetchPatients = async () => {
		try {
			const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/patients', {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${idToken}`,
				},
			});

			if (!response.ok) {
				throw new Error('Failed to fetch patients');
			}

			const result = await response.json();
			setPatients(result.patients);
		} catch (error) {
			console.error('Fetch Patients Error:', error);
			alert('Failed to fetch patients');
		}
	};

	useEffect(() => {
		if (!isLoading && idToken) {
			fetchPatients();
		}
	}, [isLoading, idToken]);

	return (
		<div className="flex flex-col items-center justify-center p-4 bg-gray-100">
			<H5>Add Patient</H5>
			<div className="w-full mb-4">
				<input
					type="text"
					value={patientName}
					onChange={(e) => setPatientName(e.target.value)}
					placeholder="Patient Name"
					className="w-full p-2 border border-gray-300 rounded-md mb-2"
				/>
			</div>
			<button
				onClick={addPatient}
				className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300"
			>
				Add Patient
			</button>
			<WhiteSpace height={"50px"} />
			<H5>Patients</H5>
			{patients.length > 0 ? (
				<div className="w-full">
					{patients.map((patient, index) => (
						<div key={index} className="p-4 border border-gray-300 rounded-md mb-2">
							<P1><strong>Patient ID:</strong> {patient.uid}</P1>
							<P1><strong>Name:</strong> {patient.name}</P1>
							<P1><strong>Created At:</strong> {new Date(patient.created_at).toLocaleString()}</P1>
							<P1><strong>Updated At:</strong> {new Date(patient.updated_at).toLocaleString()}</P1>
							{patient.intakes && patient.intakes.length > 0 && (
								<div className="mt-4">
									<H5>Intakes</H5>
									{patient.intakes.map((intake:any, intakeIndex:any) => (
										<div key={intakeIndex}
											 className="p-4 border border-gray-200 rounded-md mb-4 shadow-sm">
											<P2><strong>Date:</strong> {new Date(intake.date).toLocaleString()}</P2>
											<div className="mt-2">
												<H5 className="text-green-600">Preparation and Introduction</H5>
												<P2>{intake.preparation_intro || 'N/A'}</P2>
											</div>
											<div className="mt-2">
												<H5 className="text-blue-600">History Taking</H5>
												<P2>{intake.history_taking || 'N/A'}</P2>
											</div>
											<div className="mt-2">
												<H5 className="text-purple-600">Physical Examination</H5>
												<P2>{intake.physical_exam || 'N/A'}</P2>
											</div>
											<div className="mt-2">
												<H5 className="text-orange-600">Diagnostic Testing</H5>
												<P2>{intake.diagnostic_testing || 'N/A'}</P2>
											</div>
											<div className="mt-2">
												<H5 className="text-red-600">Diagnosis</H5>
												<P2>{intake.diagnosis || 'N/A'}</P2>
											</div>
											<div className="mt-2">
												<H5 className="text-teal-600">Treatment Plan</H5>
												<P2>{intake.treatment_plan || 'N/A'}</P2>
											</div>
											<div className="mt-2">
												<H5 className="text-pink-600">Client Education and Instructions</H5>
												<P2>{intake.client_education || 'N/A'}</P2>
											</div>
											<div className="mt-2">
												<H5 className="text-yellow-600">Conclusion</H5>
												<P2>{intake.conclusion || 'N/A'}</P2>
											</div>
											{/*<div className="mt-2">*/}
											{/*	<H5 className="text-gray-600">Transcription</H5>*/}
											{/*	<P2>{intake.transcription}</P2>*/}
											{/*</div>*/}
											{intake.file_url && (
												<div className="mt-2">
													<P1><strong>File URL:</strong> <a href={intake.file_url}
																					  target="_blank"
																					  rel="noopener noreferrer"
																					  className="text-blue-500 underline">View
														File</a></P1>
												</div>
											)}
										</div>
									))}
								</div>
							)}
						</div>
					))}
				</div>
			) : (
				<P1>No patients added yet.</P1>
			)}

			<WhiteSpace height={'100px'}/>
			<H5>Intake of patient</H5>
			<Intake/>
			<WhiteSpace height={'100px'}/>
		</div>
	);
};


const Intake: React.FC = () => {
	const [patientId, setPatientId] = useState<string>('');
	const [file, setFile] = useState<File | null>(null);
	const [message, setMessage] = useState<string>('');
	const {idToken, isLoading} = useAuth();

	const onDrop = (acceptedFiles: File[]) => {
		if (acceptedFiles.length > 0) {
			setFile(acceptedFiles[0]);
		}
	};

	const {getRootProps, getInputProps} = useDropzone({
		onDrop,
		// @ts-ignore
		accept: '.mp3,.war'
	});

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		if (!patientId || !file) {
			setMessage('Patient ID and file are required');
			return;
		}

		const formData = new FormData();
		formData.append('patient_id', patientId);
		formData.append('file', file);

		try {
			const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/intake", {
				headers: {
					"Authorization": `Bearer ${idToken}`,
				},
				method: 'POST',
				body: formData,
			});
			const data = await response.json();
			if (response.ok) {
				setMessage(data.message);
				setPatientId('');
				setFile(null);
			} else {
				setMessage(data.error || 'Failed to process intake');
			}
		} catch (error) {
			setMessage('Failed to process intake');
		}
	};

	return (
		<div className="flex flex-col items-center justify-center p-4 bg-gray-100">
			<form onSubmit={handleSubmit} className="w-full max-w-md">
				<div className="mb-4">
					<label className="block text-gray-700 text-sm font-bold mb-2">Patient ID:</label>
					<input
						type="text"
						value={patientId}
						onChange={(e) => setPatientId(e.target.value)}
						placeholder="Enter Patient ID"
						className="w-full p-2 border border-gray-300 rounded-md"
						required
					/>
				</div>
				<div {...getRootProps({className: 'dropzone border-dashed border-2 border-gray-300 rounded-md p-4 text-center mb-4'})}>
					<input {...getInputProps()} />
					{file ? <p>{file.name}</p> :
						<p>Drag 'n' drop a MP3 or WAR file here of the consultation, or click to select one</p>}
				</div>
				<button type="submit"
						className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300">
					Submit
				</button>
			</form>
			{message && <p className="mt-4 text-center text-red-500">{message}</p>}
		</div>
	);
};

const Researcher = () => {
	const {idToken} = useAuth();
	const [file, setFile] = useState<File | null>(null);
	const [title, setTitle] = useState<string>("");
	const [author, setAuthor] = useState<string>("");
	const [papers, setPapers] = useState<any[]>([]);

	const onDrop = (acceptedFiles: File[]) => {
		if (acceptedFiles && acceptedFiles.length > 0) {
			setFile(acceptedFiles[0]);
		}
	};

	const {getRootProps, getInputProps} = useDropzone({onDrop});

	const handleUpload = async () => {
		if (!file || !title || !author) {
			alert("Please provide a file, title, and author.");
			return;
		}

		try {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('title', title);
			formData.append('author', author);

			const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/upload-pdf", {
				method: 'POST',
				headers: {
					"Authorization": `Bearer ${idToken}`,
				},
				body: formData,
			});

			if (!response.ok) {
				throw new Error('Failed to upload file');
			}

			const result = await response.json();
			alert(`File uploaded successfully. Summary: ${result.summary}`);
			fetchPapers(); // Refresh the list of papers after uploading a new one
		} catch (error) {
			console.error('Upload Error:', error);
			alert('Failed to upload file');
		}
	};

	const fetchPapers = async () => {
		try {
			const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/all-papers", {
				method: 'GET',
				headers: {
					"Authorization": `Bearer ${idToken}`,
				},
			});

			if (!response.ok) {
				throw new Error('Failed to fetch papers');
			}

			const result = await response.json();
			setPapers(result.papers);
		} catch (error) {
			console.error('Fetch Papers Error:', error);
			alert('Failed to fetch papers');
		}
	};

	useEffect(() => {
		fetchPapers();
	}, []);

	return (
		<div className="flex flex-col items-center justify-center p-4 bg-gray-100">
			<WhiteSpace height={"100px"}/>
			<H5>Upload PDFs</H5>
			<H6 textAlign={"center"}>You only see this if you have the role researcher</H6>
			<WhiteSpace height={"50px"}/>
			<div className="w-full mb-4">
				<input
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="Title"
					className="w-full p-2 border border-gray-300 rounded-md mb-2"
				/>
				<input
					type="text"
					value={author}
					onChange={(e) => setAuthor(e.target.value)}
					placeholder="Author"
					className="w-full p-2 border border-gray-300 rounded-md mb-2"
				/>
			</div>
			<div {...getRootProps()}
				 className="w-full p-2 border border-gray-300 rounded-md text-center cursor-pointer mb-2">
				<input {...getInputProps()} />
				{file ? file.name : 'Drag and drop a PDF here, or click to select a PDF'}
			</div>
			<button
				onClick={handleUpload}
				className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
			>
				Upload
			</button>
			<WhiteSpace height={"50px"}/>
			<H5>Uploaded Papers</H5>
			{papers.length > 0 ? (
				<div className="w-full">
					{papers.map((paper, index) => (
						<div key={index} className="p-4 border border-gray-300 rounded-md mb-2">
							<P1><strong>Title:</strong> {paper.title}</P1>
							<P1><strong>Author:</strong> {paper.author}</P1>
							<P1><strong>Summary:</strong> {paper.summary}</P1>
							<a href={paper.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
								View PDF
							</a>
						</div>
					))}
				</div>
			) : (
				<P1>No papers uploaded yet.</P1>
			)}
			<WhiteSpace height={"100px"}/>
		</div>
	);
};

const UserInfo = ({userData}: { userData: any }) => (
	<div className={"flex-col"}>
		<P1>Email: {userData.email}</P1>
		<P1>Roles: {userData.roles}</P1>
		<P1>Requests left: {userData.request_count}</P1>
	</div>
);

const DogInfo = ({dogData}: { dogData: any }) => {
	const formatDate = (date: Date | string | null): string => {
		if (typeof date === 'string') {
			date = new Date(date); // Convert string to Date object
		}
		return date instanceof Date && !isNaN(date.getTime()) ? date.toLocaleDateString() : "N/A";
	}

	return (
		<div className={"flex lg:flex-col"}>
			{dogData ? Object.entries(dogData).map(([key, value]) => {
				const displayValue = key === 'birthDate' ? formatDate(value as Date) : value;
				return (
					<div key={key}>
						<P1>{key}: <>{displayValue}</></P1>
					</div>
				);
			}) : <H4 textAlign={"center"}>No dog data found :(</H4>}
		</div>
	);
};

export default function Home({params: {locale}}: HomeProps) {
	const isMobile = useIsMobile();
	const {user, userData, isLoading} = useAuth();
	const [translations, setTranslations] = useState<ITranslations | null>(null);

	useEffect(() => {
		initTranslations(locale, ['default']).then(trans => {
			setTranslations(trans);
		});
	}, [locale]);

	if (!translations || isLoading) {
		return <Loading/>;
	}

	const dogData = userData?.dog;
	let userDog: Dog | null = null;
	if (dogData) {
		const birthDate = dogData.birthDate ? new Date(dogData.birthDate) : null;
		userDog = new Dog(dogData.dogName, dogData.sex, dogData.selectedBreed, birthDate!);
	}

	return (
		<TranslationsProvider
			namespaces={['default']}
			locale={locale}
			resources={translations.resources}>
			<main className="border-2 w-full flex items-center justify-center">
				{
					!user || !userData?.vet_ai_is_white_listed ?
						<WelcomeAi isUserLoggedIn={false} isMobile={isMobile}/> :
						<div className={"w-[80%] "}>
							<H6 textAlign={"center"}>DogTalk behaviour coach</H6>
							<div className={"flex lg:flex-row justify-around "}>
								{userData ? <UserInfo userData={userData}/> :
									<H4 textAlign={"center"}>No user data found :(</H4>}
								<DogInfo dogData={userData?.dog}/>
							</div>
							<WhiteSpace height={"50px"}/>
							<Chat dog={userDog!} isMobile={isMobile}/>
							{
								userData?.roles?.map((role: string) => role === 'researcher' ?
									<Researcher key={role}/> : null)
							}
							{
								userData?.roles?.map((role: string) => role === 'user' ?
									<User key={role}/> : null)
							}
						</div>
				}
			</main>
		</TranslationsProvider>
	);
}
