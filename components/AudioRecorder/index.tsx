'use client'

import { useRouter } from 'next/navigation';

import React, { useCallback, useState } from "react";
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import { useAuth } from "@/components/auth/auth";
import { useFilePicker } from "use-file-picker";
import { SmallPrimaryButtonNew, WhiteSpace } from "@/components";
import LoadingDots from "@/components/LoadingDots";
import { useStopwatch } from "react-timer-hook";

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


export const AudioRecorderComponent: React.FC = () => {
	const {idToken, userData, isLoading} = useAuth();
	const recorderControls = useAudioRecorder();
	const router = useRouter();
	const [audioSrc, setAudioSrc] = useState<string | null>(null);
	const [consultationName, setConsultationName] = useState('');
	const [isUploading, setIsUploading] = useState(false);

	//  stop watch stuff
	const {
		seconds,
		minutes,
		start,
		pause,
		reset,
		isRunning
	} = useStopwatch({autoStart: false});
	const formatTime = (time: number): string => {
		return time < 10 ? `0${time}` : `${time}`;
	};

	const {openFilePicker, filesContent, loading, errors} = useFilePicker({
		accept: 'audio/*',
		multiple: true,
		onFilesSelected: ({plainFiles, filesContent, errors}) => {
			// this callback is always called, even if there are errors
			console.log('onFilesSelected', plainFiles, filesContent, errors);
		},
		onFilesRejected: ({errors}) => {
			// this callback is called when there were validation errors
			console.log('onFilesRejected', errors);
		},
		// @ts-ignore
		onFilesSuccessfullySelected: ({plainFiles, filesContent}) => {
			// this callback is called when there were no validation errors
			console.log('onFilesSuccessfullySelected', plainFiles, filesContent);
			if (plainFiles.length > 0) {
				handleUpload(plainFiles[0], plainFiles[0].name);
			}
		},
	});


	const handleUpload = useCallback(async (file: Blob, fileName: string) => {
		if (!idToken) return;
		setIsUploading(true);
		try {
			const result = await handleFileUpload(file, fileName, consultationName, idToken);
			// @ts-ignore
			router.push(`/consultation/${result.id}`);
		} catch (error) {
			console.error('File upload failed:', error);
			alert('Error: ' + (error as Error).message);
		} finally {
			setIsUploading(false);
		}
	}, [idToken, consultationName, router]);


	const addAudioElement = async (blob: Blob) => {
		const url = URL.createObjectURL(blob);
		setAudioSrc(url);
		handleUpload(blob, 'recorded_audio.mp3');
	};

	if (isLoading) {
		return <div className="flex justify-center items-center h-screen">
			<LoadingDots/>
		</div>;
	}


	if (isUploading) {
		return (
			<div className={"flex flex-col"}>
				<WhiteSpace height={"90px"}/>
				{/* Replaces <WhiteSpace height={"90px"} /> */}
				<h1 className={"text-[40px] lg:ml-[115px]"}>
					Konsultation: AI genererar resultat
				</h1>
				<WhiteSpace height={"179px"}/>
				<div className="flex justify-center flex-col items-center ">
					<div className="flex justify-center items-center flex-col">
						<svg xmlns="http://www.w3.org/2000/svg" width="411" height="147" viewBox="0 0 411 147"
							 fill="none">
							<path
								d="M10 73.5C23.0333 158.167 36.0667 158.167 49.1 73.5C62.1333 -11.1667 75.1667 -11.1667 88.2 73.5C101.233 158.167 114.267 158.167 127.3 73.5C140.333 -11.1667 153.367 -11.1667 166.4 73.5C179.433 158.167 192.467 158.167 205.5 73.5C218.533 -11.1667 231.567 -11.1667 244.6 73.5C257.633 158.167 270.667 158.167 283.7 73.5C296.733 -11.1667 309.767 -11.1667 322.8 73.5C335.833 158.167 348.867 158.167 361.9 73.5C374.933 -11.1667 387.967 -11.1667 401 73.5"
								stroke="#EDE6FF" strokeWidth="20"
							/>
						</svg>
						<WhiteSpace height={"31px"}/>
						<p className="font-inter">AI genererar resultat...</p>
					</div>
				</div>
			</div>
		);
	}

	const handleStartRecording = () => {
		recorderControls.startRecording();
		start();
	};

	const handlePauseRecording = () => {
		recorderControls.isPaused ? start() : pause();
		recorderControls.togglePauseResume();
	};

	const handleStopRecording = () => {
		recorderControls.stopRecording();
		reset();
	};


	return (
		<div className={"flex flex-col"}>
			<WhiteSpace height={"90px"}/>
			<div className={" lg:ml-[115px] "}>
				{recorderControls.isRecording && !recorderControls.isPaused ? (
					<h1 className={"text-[40px]"}>
						Konsultation: Inspelning pågår
					</h1>
				) : recorderControls.isPaused ? (
					<h1 className={"text-[40px]"}>
						Konsultation: Inspelning pausad
					</h1>
				) : (
					<>
						<h1 className={"text-[40px] mb-[14px]"}>
							God morgon, {userData?.name}
						</h1>
						<p className={"max-w-[507px] font-inter text-[12px]"}>För att börja, ange ett namn på
							konsultationen och välj att
							ladda upp en fil
							från en tidigare konsultation eller starta en ny inspelning av en konsultation. När AI:n
							har
							analyserat inspelningen får du en sammanfattning av konsultationen. Lycka till med
							journalföringen!</p>
					</>
				)}
				<WhiteSpace height={"14px"}/>
			</div>
			<WhiteSpace height={"70px"}/>
			<div className="flex justify-center flex-col items-center ">
				{!recorderControls.isRecording &&
					<input
						type="text"
						placeholder="Namn på konsultation"
						value={consultationName}
						onChange={(e) => setConsultationName(e.target.value)}
						className={"rounded-[8px] font-inter text-[#838383] bg-[#FEFDFD] border-black text-[14px] min-w-[294px] border-[0.25px] p-[16px]"}
					/>
				}
				<AudioRecorder
					onRecordingComplete={addAudioElement}
					recorderControls={recorderControls}
				/>
				{audioSrc && <audio controls src={audioSrc}/>}
				<WhiteSpace height={"32px"}/>
				<div className="flex flex-col items-center">
					{!recorderControls.isRecording ? (
						// IS NOT RECORDING 
						<div className={"flex flex-row"}>
							<div className={"max-w-[216px] flex flex-col justify-center items-center"}>
								<svg xmlns="http://www.w3.org/2000/svg" width="97" height="97" viewBox="0 0 97 97"
									 fill="none">
									<g opacity="0.2" filter="url(#filter0_f_4015_30567)">
										<circle cx="48.3854" cy="48.3854" r="47.3854" fill="#B6FFB2"/>
									</g>
									<circle cx="48.1161" cy="48.6517" r="41.2626" fill="#BBEDD6"/>
									<path
										d="M46.6739 55.17V41.3827L42.2755 45.7811L39.9071 43.3281L48.3656 34.8696L56.8241 43.3281L54.4557 45.7811L50.0573 41.3827V55.17H46.6739ZM38.2154 61.9368C37.285 61.9368 36.4885 61.6055 35.8259 60.9429C35.1633 60.2804 34.832 59.4838 34.832 58.5534V53.4783H38.2154V58.5534H58.5158V53.4783H61.8992V58.5534C61.8992 59.4838 61.5679 60.2804 60.9053 60.9429C60.2428 61.6055 59.4462 61.9368 58.5158 61.9368H38.2154Z"
										fill="white"/>
									<defs>
										<filter id="filter0_f_4015_30567" x="0" y="0" width="96.7715" height="96.771"
												filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
											<feFlood flood-opacity="0" result="BackgroundImageFix"/>
											<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix"
													 result="shape"/>
											<feGaussianBlur stdDeviation="0.5"
															result="effect1_foregroundBlur_4015_30567"/>
										</filter>
									</defs>
								</svg>
								<WhiteSpace height={"12px"}/>
								<p className={"font-inter text-[12px] text-center"}>Välj en ljudfil från en konsultation
									att
									ladda upp från din enhet.</p>
								<WhiteSpace height={"12px"}/>
								<SmallPrimaryButtonNew
									border={true}
									onClick={openFilePicker}
									text={"LADDA UPP FIL"}
								/>
							</div>
							<WhiteSpace width={"55px"}/>
							<div className={"max-w-[216px] flex flex-col justify-center items-center"}>
								<svg xmlns="http://www.w3.org/2000/svg" width="97" height="98" viewBox="0 0 97 98"
									 fill="none">
									<g opacity="0.2" filter="url(#filter0_f_4015_30561)">
										<circle cx="48.385" cy="48.9646" r="47.385" fill="#B6FFB2"/>
									</g>
									<circle cx="48.1196" cy="49.231" r="41.2622" fill="#BBEDD6"/>
									<path
										d="M48.3854 53.7843C46.8642 53.7843 45.5712 53.2531 44.5064 52.1906C43.4415 51.1281 42.9091 49.8379 42.9091 48.32V37.3915C42.9091 35.8737 43.4415 34.5835 44.5064 33.521C45.5712 32.4585 46.8642 31.9272 48.3854 31.9272C49.9066 31.9272 51.1996 32.4585 52.2644 33.521C53.3293 34.5835 53.8617 35.8737 53.8617 37.3915V48.32C53.8617 49.8379 53.3293 51.1281 52.2644 52.1906C51.1996 53.2531 49.9066 53.7843 48.3854 53.7843ZM46.56 66.5343V60.9334C43.3959 60.5084 40.7795 59.0968 38.7106 56.6986C36.6418 54.3004 35.6074 51.5075 35.6074 48.32H39.2583C39.2583 50.8397 40.1482 52.9874 41.928 54.7633C43.7077 56.5392 45.8602 57.4272 48.3854 57.4272C50.9106 57.4272 53.063 56.5392 54.8428 54.7633C56.6226 52.9874 57.5125 50.8397 57.5125 48.32H61.1634C61.1634 51.5075 60.129 54.3004 58.0602 56.6986C55.9913 59.0968 53.3749 60.5084 50.2108 60.9334V66.5343H46.56ZM48.3854 50.1415C48.9026 50.1415 49.3361 49.9669 49.686 49.6178C50.0359 49.2687 50.2108 48.8361 50.2108 48.32V37.3915C50.2108 36.8754 50.0359 36.4429 49.686 36.0937C49.3361 35.7446 48.9026 35.5701 48.3854 35.5701C47.8682 35.5701 47.4347 35.7446 47.0848 36.0937C46.7349 36.4429 46.56 36.8754 46.56 37.3915V48.32C46.56 48.8361 46.7349 49.2687 47.0848 49.6178C47.4347 49.9669 47.8682 50.1415 48.3854 50.1415Z"
										fill="white"/>
									<defs>
										<filter id="filter0_f_4015_30561" x="0" y="0.57959" width="96.7695"
												height="96.77"
												filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
											<feFlood flood-opacity="0" result="BackgroundImageFix"/>
											<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix"
													 result="shape"/>
											<feGaussianBlur stdDeviation="0.5"
															result="effect1_foregroundBlur_4015_30561"/>
										</filter>
									</defs>
								</svg>
								<WhiteSpace height={"12px"}/>
								<p className={"font-inter text-[12px] text-center"}>Spela in en konsultation med
									mikrofon på
									din enhet.</p>
								<WhiteSpace height={"12px"}/>
								<SmallPrimaryButtonNew
									isWhite={true}
									border={true}
									onClick={handleStartRecording}
									text={"STARTA INSPELNINGEN"}
								/>
							</div>
						</div>
					) : (
						// is Recording
						<div className={"flex flex-col justify-center items-center"}>
							<h2 className="text-[70px]">{formatTime(minutes)}:{formatTime(seconds)}</h2>
							<p className={"text-center font-inter text-[20px]"}>
								{
									recorderControls.isPaused ? "Inspelning är pausad" : "Lyssnar på konsultation..."
								}
							</p>
							<div className={"flex flex-row"}>
								<div className={"max-w-[216px] flex flex-col justify-center items-center"}>
									<svg xmlns="http://www.w3.org/2000/svg" width="97" height="97" viewBox="0 0 97 97"
										 fill="none">
										<g opacity="0.2" filter="url(#filter0_f_4015_28992)">
											<circle cx="48.385" cy="48.385" r="47.385" fill="#B6FFB2"/>
										</g>
										<circle cx="48.1177" cy="48.6514" r="41.2622" fill="#BBEDD6"/>
										<path
											d="M43.2806 60.5472L31.4492 48.6794L34.4071 45.7124L43.2806 54.6133L62.325 35.5103L65.2829 38.4772L43.2806 60.5472Z"
											fill="white"/>
										<defs>
											<filter id="filter0_f_4015_28992" x="0" y="0" width="96.7695" height="96.77"
													filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
												<feFlood flood-opacity="0" result="BackgroundImageFix"/>
												<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix"
														 result="shape"/>
												<feGaussianBlur stdDeviation="0.5"
																result="effect1_foregroundBlur_4015_28992"/>
											</filter>
										</defs>
									</svg>
									<WhiteSpace height={"12px"}/>
									<p className={"font-inter text-[12px] text-center"}>Klicka på Klar-knappen när du är
										färdig med inspelningen.</p>
									<WhiteSpace height={"12px"}/>
									<SmallPrimaryButtonNew
										border={true}
										onClick={handleStopRecording}
										text={"KLAR"}
									/>

								</div>
								{/*PAUS AND CONTINUE*/}
								<WhiteSpace width={"55px"}/>
								<div className={"max-w-[216px] flex flex-col justify-center items-center"}>
									{!recorderControls.isPaused ?
										<svg xmlns="http://www.w3.org/2000/svg" width="97" height="97"
											 viewBox="0 0 97 97"
											 fill="none">
											<g opacity="0.2" filter="url(#filter0_f_4015_28985)">
												<circle cx="48.385" cy="48.385" r="47.385" fill="#FFEEB2"/>
											</g>
											<circle cx="48.1177" cy="48.6514" r="41.2622" fill="#EDE8BB"/>
											<rect x="34.543" y="34.0098" width="9.58348" height="29.2829" fill="white"/>
											<rect x="52.1094" y="34.0098" width="9.58348" height="29.2829"
												  fill="white"/>
											<defs>
												<filter id="filter0_f_4015_28985" x="0" y="0" width="96.7695"
														height="96.77"
														filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
													<feFlood flood-opacity="0" result="BackgroundImageFix"/>
													<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix"
															 result="shape"/>
													<feGaussianBlur stdDeviation="0.5"
																	result="effect1_foregroundBlur_4015_28985"/>
												</filter>
											</defs>
										</svg>
										:
										<svg xmlns="http://www.w3.org/2000/svg" width="97" height="98"
											 viewBox="0 0 97 98" fill="none">
											<g opacity="0.2" filter="url(#filter0_f_4015_29031)">
												<circle cx="48.385" cy="48.9646" r="47.385" fill="#B6FFB2"/>
											</g>
											<circle cx="48.1216" cy="49.231" r="41.2622" fill="#BBEDD6"/>
											<path
												d="M48.3874 53.7843C46.8662 53.7843 45.5732 53.2531 44.5083 52.1906C43.4435 51.1281 42.9111 49.8379 42.9111 48.32V37.3915C42.9111 35.8737 43.4435 34.5835 44.5083 33.521C45.5732 32.4585 46.8662 31.9272 48.3874 31.9272C49.9085 31.9272 51.2015 32.4585 52.2664 33.521C53.3312 34.5835 53.8636 35.8737 53.8636 37.3915V48.32C53.8636 49.8379 53.3312 51.1281 52.2664 52.1906C51.2015 53.2531 49.9085 53.7843 48.3874 53.7843ZM46.5619 66.5343V60.9334C43.3979 60.5084 40.7814 59.0968 38.7126 56.6986C36.6438 54.3004 35.6094 51.5075 35.6094 48.32H39.2602C39.2602 50.8397 40.1501 52.9874 41.9299 54.7633C43.7097 56.5392 45.8622 57.4272 48.3874 57.4272C50.9125 57.4272 53.065 56.5392 54.8448 54.7633C56.6246 52.9874 57.5145 50.8397 57.5145 48.32H61.1653C61.1653 51.5075 60.1309 54.3004 58.0621 56.6986C55.9933 59.0968 53.3768 60.5084 50.2128 60.9334V66.5343H46.5619ZM48.3874 50.1415C48.9046 50.1415 49.3381 49.9669 49.688 49.6178C50.0378 49.2687 50.2128 48.8361 50.2128 48.32V37.3915C50.2128 36.8754 50.0378 36.4429 49.688 36.0937C49.3381 35.7446 48.9046 35.5701 48.3874 35.5701C47.8701 35.5701 47.4366 35.7446 47.0867 36.0937C46.7369 36.4429 46.5619 36.8754 46.5619 37.3915V48.32C46.5619 48.8361 46.7369 49.2687 47.0867 49.6178C47.4366 49.9669 47.8701 50.1415 48.3874 50.1415Z"
												fill="white"/>
											<defs>
												<filter id="filter0_f_4015_29031" x="0" y="0.57959" width="96.7695"
														height="96.77" filterUnits="userSpaceOnUse"
														color-interpolation-filters="sRGB">
													<feFlood flood-opacity="0" result="BackgroundImageFix"/>
													<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix"
															 result="shape"/>
													<feGaussianBlur stdDeviation="0.5"
																	result="effect1_foregroundBlur_4015_29031"/>
												</filter>
											</defs>
										</svg>

									}

									<WhiteSpace height={"12px"}/>
									<p className={"font-inter text-[12px] text-center"}>
										{
											recorderControls.isPaused ? "Klicka på Återuppta-knappen för att fortsätta inspelningen." : "Klicka på Paus-knappen för att ta en paus i inspelningen."
										}
									</p>
									<WhiteSpace height={"12px"}/> <SmallPrimaryButtonNew
									border={true}
									isWhite={true}
									onClick={handlePauseRecording}
									text={recorderControls.isPaused ? 'ÅTERUPPTA' : 'PAUS'}
								/>
									<WhiteSpace width={"55px"}/>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>

	);
};

export default AudioRecorderComponent;
