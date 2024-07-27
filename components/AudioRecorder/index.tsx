'use client'

import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import { useState, useEffect } from "react";
import { useFilePicker } from "use-file-picker";
import { useAuth } from "@/components/auth/auth";

const handleFileUpload = async (file: Blob, fileName: string, idToken: string) => {
	if (!idToken) {
		console.error('ID Token not available.');
		return;
	}
	const formData = new FormData();
	formData.append('file', file, fileName);
	formData.append('name', fileName);
	try {
		const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/upload-consultation', {
			headers: {
				"Authorization": `Bearer ${idToken}`,
			},
			method: 'POST',
			body: formData,
		});
		if (response.ok) {
			console.log('File uploaded successfully');
			const s = await response.json();
			console.log(s);
		} else {
			console.error('Failed to upload file');
		}
	} catch (error) {
		console.error('Error uploading file:', error);
	}
};

const ConsultationComponent: React.FC<{ onStartRecording: () => void, idToken: string }> = ({onStartRecording, idToken}) => {
	const {openFilePicker, filesContent, loading} = useFilePicker({
		accept: 'audio/*',
	});

	const uploadFile = async (file: any) => {
		const blob = new Blob([file.content], {type: file.mimeType});
		handleFileUpload(blob, file.name, idToken);
	};

	useEffect(() => {
		if (filesContent.length > 0) {
			uploadFile(filesContent[0]);
		}
	}, [filesContent]);

	return (
		<div className="flex flex-col items-center justify-center bg-gray-100">
			<div className="mb-4">
				<input
					type="text"
					placeholder="Namn på konsultation"
					className="w-72 p-2 border border-gray-300 rounded-md"
				/>
			</div>
			<div className="flex space-x-8">
				<div className="flex flex-col items-center">
					<div className="w-16 h-16 mb-2 flex items-center justify-center bg-green-100 rounded-full">
						<span className="text-gray-400">📤</span>
					</div>
					<p className="text-center text-gray-600 text-sm">
						Välj en ljudfil från en konsultation att ladda upp från din enhet.
					</p>
					<button
						onClick={() => openFilePicker()}
						className="mt-2 px-4 py-2 bg-black text-white rounded-md"
					>
						LADDA UPP FIL
					</button>
				</div>
				<div className="flex flex-col items-center">
					<div className="w-16 h-16 mb-2 flex items-center justify-center bg-green-100 rounded-full">
						<span className="text-gray-400">🎤</span>
					</div>
					<p className="text-center text-gray-600 text-sm">
						Spela in en konsultation med mikrofon på din enhet.
					</p>
					<button
						onClick={onStartRecording}
						className="mt-2 px-4 py-2 bg-white border border-black text-black rounded-md"
					>
						STARTA INSPELNING
					</button>
				</div>
			</div>
		</div>
	);
};

const RecordingComponent: React.FC<{
	onStopRecording: () => void,
	onPauseRecording: () => void,
	isPaused: boolean
}> = ({onStopRecording, onPauseRecording, isPaused}) => {
	return (
		<div className="flex flex-row items-center justify-center bg-gray-100">
			<div className="flex flex-col items-center">
				<div className="w-16 h-16 mb-2 flex items-center justify-center bg-green-100 rounded-full">
					<span className="text-gray-400">✅</span>
				</div>
				<p className="text-center text-gray-600 text-sm">
					Klicka på Klar-knappen när du känner dig färdig med inspelningen.
				</p>
				<button
					onClick={onStopRecording}
					className="mt-2 px-4 py-2 bg-black text-white rounded-md"
				>
					KLAR
				</button>
			</div>
			<div className="flex flex-col items-center">
				<div
					className={`w-16 h-16 mb-2 flex items-center justify-center rounded-full ${isPaused ? 'bg-green-100' : 'bg-yellow-100'}`}>
					<span className="text-gray-400">{isPaused ? '▶️' : '⏸'}</span>
				</div>
				<p className="text-center text-gray-600 text-sm">
					{isPaused ? 'Klicka på Återuppta-knappen om du vill fortsätta inspelningen.' : 'Klicka på Paus-knappen om du vill ta en paus i inspelningen.'}
				</p>
				<button
					onClick={onPauseRecording}
					className="mt-2 px-4 py-2 bg-white border border-black text-black rounded-md"
				>
					{isPaused ? 'ÅTERUPPTA' : 'PAUS'}
				</button>
			</div>
		</div>
	);
};

export const AudioRecorderComponent = () => {
	const {idToken} = useAuth();
	const recorderControls = useAudioRecorder();
	const [isRecording, setIsRecording] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [audioSrc, setAudioSrc] = useState<string | null>(null);

	const addAudioElement = (blob: Blob) => {
		const url = URL.createObjectURL(blob);
		setAudioSrc(url);
		handleFileUpload(blob, 'recorded_audio.mp3', idToken!);
	};

	const startRecording = () => {
		recorderControls.startRecording();
		setIsRecording(true);
		setIsPaused(false);
	};

	const stopRecording = () => {
		recorderControls.stopRecording();
		setIsRecording(false);
		setIsPaused(false);
	};

	const pauseRecording = () => {
		recorderControls.togglePauseResume();
		setIsPaused(!isPaused);
	};

	return (
		<div className={"flex justify-center flex-col items-center"}>
			<AudioRecorder
				onRecordingComplete={(blob) => addAudioElement(blob)}
				recorderControls={recorderControls}
				showVisualizer={true}
			/>
			{audioSrc && <audio controls={true} src={audioSrc}></audio>}
			{!isRecording ? (
				<ConsultationComponent onStartRecording={startRecording} idToken={idToken!}/>
			) : (
				<RecordingComponent onStopRecording={stopRecording} onPauseRecording={pauseRecording}
									isPaused={isPaused}/>
			)}
			<button/>
		</div>
	);
};
