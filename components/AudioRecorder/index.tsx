'use client'

import { useRouter } from 'next/navigation';

import React, { useState, useCallback } from "react";
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import { useAuth } from "@/components/auth/auth";

const handleFileUpload = async (file: Blob, fileName: string, consultationName: string, idToken: string): Promise<string> => {
	if (!idToken) {
		throw new Error('ID Token not available.');
	}
	const formData = new FormData();
	formData.append('file', file, fileName);
	formData.append('name', consultationName);
	const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/upload-consultation', {
		headers: {
			"Authorization": `Bearer ${idToken}`,
		},
		method: 'POST',
		body: formData,
	});
	if (!response.ok) {
		throw new Error('Failed to upload file');
	}
	return await response.json();
};

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => (
	<button
		className={`px-4 py-2 rounded-md ${className}`}
		{...props}
	>
		{children}
	</button>
);

export const AudioRecorderComponent: React.FC = () => {
	const { idToken } = useAuth();
	const recorderControls = useAudioRecorder();
	const router = useRouter();
	const [audioSrc, setAudioSrc] = useState<string | null>(null);
	const [consultationName, setConsultationName] = useState('');
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState(false);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedFile(file);
		}
	};

	const handleUpload = useCallback(async (file: Blob, fileName: string) => {
		if (!idToken) return;

		setIsUploading(true);
		try {
			const result  = await handleFileUpload(file, fileName, consultationName, idToken);
			// @ts-ignore
			router.push(`/consultation/${result.id}`);
		} catch (error) {
			console.error('File upload failed:', error);
			alert('Error: ' + (error as Error).message);
		} finally {
			setIsUploading(false);
		}
	}, [idToken, consultationName, router]);

	const uploadFile = useCallback(() => {
		if (selectedFile) {
			handleUpload(selectedFile, selectedFile.name);
		}
	}, [selectedFile, handleUpload]);

	const addAudioElement = async (blob: Blob) => {
		const url = URL.createObjectURL(blob);
		setAudioSrc(url);
		handleUpload(blob, 'recorded_audio.mp3');
	};

	if (isUploading) {
		return (
			<div className="flex justify-center items-center h-screen w-full">
				<svg xmlns="http://www.w3.org/2000/svg" width="411" height="147" viewBox="0 0 411 147" fill="none">
					<path
						d="M10 73.5C23.0333 158.167 36.0667 158.167 49.1 73.5C62.1333 -11.1667 75.1667 -11.1667 88.2 73.5C101.233 158.167 114.267 158.167 127.3 73.5C140.333 -11.1667 153.367 -11.1667 166.4 73.5C179.433 158.167 192.467 158.167 205.5 73.5C218.533 -11.1667 231.567 -11.1667 244.6 73.5C257.633 158.167 270.667 158.167 283.7 73.5C296.733 -11.1667 309.767 -11.1667 322.8 73.5C335.833 158.167 348.867 158.167 361.9 73.5C374.933 -11.1667 387.967 -11.1667 401 73.5"
						stroke="#EDE6FF" stroke-width="20"/>
				</svg>
			</div>
		);
	}

	return (
		<div className="flex justify-center flex-col items-center space-y-4">
			<input
				type="text"
				placeholder="Namn på konsultation"
				value={consultationName}
				onChange={(e) => setConsultationName(e.target.value)}
				className="w-72 p-2 border border-gray-300 rounded-md"
			/>
			<AudioRecorder
				onRecordingComplete={addAudioElement}
				recorderControls={recorderControls}
				showVisualizer={true}
			/>
			{audioSrc && <audio controls src={audioSrc}/>}
			<div className="flex space-x-4">
				<div className="flex flex-col items-center">
					<input
						type="file"
						accept="audio/*"
						onChange={handleFileChange}
						className="mb-2"
					/>
					<Button
						onClick={uploadFile}
						className="bg-black text-white"
						disabled={!selectedFile}
					>
						LADDA UPP FIL
					</Button>
				</div>
				<div className="flex flex-col items-center">
					{!recorderControls.isRecording ? (
						<Button
							onClick={recorderControls.startRecording}
							className="bg-black text-white"
						>
							STARTA INSPELNING
						</Button>
					) : (
						<>
							<Button
								onClick={recorderControls.stopRecording}
								className="bg-black text-white mb-2"
							>
								KLAR
							</Button>
							<Button
								onClick={recorderControls.togglePauseResume}
								className="bg-white border border-black text-black"
							>
								{recorderControls.isPaused ? 'ÅTERUPPTA' : 'PAUS'}
							</Button>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default AudioRecorderComponent;
