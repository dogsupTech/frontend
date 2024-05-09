'use client'
import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { useAuth } from "@/components/auth/auth";
import { ForgotPassword, SignUp, Login, } from "@/components/auth";
import { SmallPrimaryButtonNew, PrimaryButtonNew, PrimaryButton } from "@/components";

import { WhiteSpace } from "@/components";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import LoadingDots from "@/components/LoadingDots";

const joinTheWaitList = async (idToken: string): Promise<Response> => {
	try {
		const response = await fetch(process.env.NEXT_PUBLIC_ACCOUNT_SERVICE_URL + "/vet-ai-join-waitlist", {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${idToken}`,
				'Cache-Control': 'no-cache' // Add this line to prevent caching
			},
		});
		const data = await response.json();
		console.log('API Response:', data);
		return data;
	} catch (error) {
		console.error('API Request Error:', error);
		throw error;
	}

}

export const WelcomeAi: React.FC<{ isUserLoggedIn: boolean; isMobile: boolean }> = ({isUserLoggedIn, isMobile}) => {
	const [view, setView] = useState<'welcome' | 'auth'>('welcome'); const [authView, setAuthView] = useState<'signup' | 'login'>('signup');  // Assuming default is 'signup'
	const {user, userData, isLoading, refreshUserData} = useAuth();
	const {idToken} = useAuth();
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const {t} = useTranslation();

	const handleJoinWaitlist = async () => {
		if (!idToken) {
			console.error('ID Token not available.');
			return;
		}
		try {
			setLoading(true);
			const response = await joinTheWaitList(idToken);  // Ensure joinTheWaitList is defined
			await refreshUserData();
		} catch (error) {
			console.error('API Request Error:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{isLoading && (<div className="flex justify-center items-center"><LoadingDots/></div>)}
			{user && !isLoading && userData && !userData.vet_ai_waitlist && !userData.vet_ai_is_white_listed &&
				<div className="flex flex-col h-[80vh] justify-center items-center">
					<p className="font-josefin-sans text-lg">Hi, {userData.email}!</p>
					<WhiteSpace height="20px"/>
					<p className="font-adieu ">Join the waitlist for vetAI</p>
					<WhiteSpace height="20px"/>
					<PrimaryButton
						isLoading={loading}
						onClick={handleJoinWaitlist}
						text="Join the waitlist"
						isDisabled={false}
						isWhite={false}
						border={false}
						isMobile={isMobile}
					/>
				</div>
			}
			{user && !isLoading && userData && userData.vet_ai_waitlist && !userData.vet_ai_is_white_listed &&
				<div className="flex flex-col justify-center items-center">
					<YouAreOnTheWaitListComponent
						email={userData.email}
						isMobile={isMobile}
						title={t('vetai.waitlist.youAreOnTheWaitlist') || ''}
						text={t('vetai.waitlist.text') || ''}
					/>
					<SmallPrimaryButtonNew
						text={t('vetai.waitlist.exploreDogsup') || ''}
						isLoading={isLoading}
						onClick={() => router.push("/")}
						isDisabled={false}
						isWhite={false}
						border={false}
						isMobile={isMobile}
					/>
				</div>
			}
			{!user && !isLoading && view === 'welcome' &&
				<WelcomeComponent setAuthView={setAuthView} setView={setView} isMobile={isMobile}/>}
			{!user && !isLoading && view === 'auth' &&
				<AuthComponent authView={authView} setAuthView={setAuthView} isMobile={isMobile}/>
			}
		</>
	);
};
export const WelcomeComponent: React.FC<{
	isMobile: boolean,
	setView: React.Dispatch<React.SetStateAction<'welcome' | 'auth'>>,
	setAuthView: React.Dispatch<React.SetStateAction<'signup' | 'login'>>
}> = ({isMobile, setView, setAuthView}) => {
	const {t} = useTranslation();
	return (
		<div style={{backgroundImage: `url("/firstPageLarge.png")`, backgroundSize: 'cover'}}
			 className={"h-screen"}>
			<Toaster
				position="top-center"
				reverseOrder={false}
			/>
			<div className=" flex justify-center items-center min-h-[60vh] lg:min-h-[80vh]">
				<div className="
				bg-sugar
                border-[1px]
                border-black
                rounded-md
                flex
                justify-center
                items-center
                flex-col
                px-[22px]
                py-[51px]
                lg:px-[167px]
                lg:py-[96px]">

					{!isMobile ? (
						<div className="flex flex-col justify-center items-center">
							<h4 className="text-center font-adieu text-[2rem]"> {/* Adjusted size for H4AndAHalf */}
								{t('vetai.welcomepage.title.first')}
							</h4>
							<h4 className="text-center font-josefin-sans text-[2rem]"> {/* Same styling for consistency */}
								{t('vetai.welcomepage.title.second')}
							</h4>
						</div>
					) : (
						<div className="flex flex-col justify-center items-center">
							<h5 className="text-center font-adieu text-[1.75rem]"> {/* Adjusted size for H5 */}
								{t('vetai.welcomepage.title.first')}
							</h5>
							<h5 className="text-center font-adieu text-[1.75rem]"> {/* Same styling for consistency */}
								{t('vetai.welcomepage.title.second')}
							</h5>
						</div>)}
					<WhiteSpace height="20px"/>
					<p className="text-center font-adieu text-base"> {/* P2 styled as simple paragraph */}
						A vet at your dog’s disposal at anytime, anywhere.
					</p>
					<WhiteSpace height="20px"/>
					<PrimaryButton
						isSmall
						onClick={() => {
							setAuthView('signup');
							setView('auth');
						}}
						text={t('vetai.welcomepage.signup')}
						isMobile={isMobile}
					/>

					<WhiteSpace height="20px"/>
					<p className="font-adieu text-center"> {/* Second P2 also styled similarly */}
						Already have an account?
						<span onClick={() => {
							setAuthView('login');
							setView('auth');
						}}
							  className="font-bold cursor-pointer underline">
              {t('vetai.welcomepage.login')}
            </span>
					</p>
				</div>
			</div>
		</div>
	)
}
export const SIGNUP_AUTH_VIEW = 'signup';
export const LOGIN_AUTH_VIEW = 'login';
export const AUTH_VIEW_FORGOT_PASSWORD = 'password';


export const AuthComponent: React.FC<{
	isMobile: boolean;
	setAuthView: React.Dispatch<React.SetStateAction<'signup' | 'login'>>;
	authView: 'signup' | 'login';
}> = ({isMobile, setAuthView, authView}) => {
	return (
		<div className={"flex flex-col lg:mt-[100px] mt-[20px] h-[80vh] items-center"}>
			{authView === LOGIN_AUTH_VIEW ?
				<Login setAuthView={setAuthView} isMobile={isMobile}/> : authView === SIGNUP_AUTH_VIEW ?
					// TODO ADD ORIGIN
					<SignUp
						origin={"don't forget to add the origin here!"}
						setAuthView={setAuthView}
						isMobile={isMobile}/> : authView === AUTH_VIEW_FORGOT_PASSWORD &&
					<ForgotPassword setAuthView={setAuthView} isMobile={isMobile}/>
			}
		</div>
	);
};

export const YouAreOnTheWaitListComponent: React.FC<{
	email: string,
	isMobile: boolean;
	title: string,
	text: string
}> = ({
		  email,
		  isMobile,
		  title,
		  text
	  }) => {
	const titleFontSize = isMobile ? 32 : 34;
	const textFontSize = isMobile ? 16 : 18;
	const titleLetterSpacing = isMobile ? "-0.68px" : "-0.68px"; // Both values are the same; could be simplified.
	const space = isMobile ? 37 : 50;

	return (
		<div className="form-wrapper"> {/* Ensure you have the correct class name for styling */}
			<WhiteSpace height={`${60}px`}/>
			<p style={{letterSpacing: titleLetterSpacing, fontSize: `${titleFontSize}px`}}
			   className="font-josefin-sans text-center">
				{title}
			</p>
			<WhiteSpace height={`${space}px`}/>
			<p style={{letterSpacing: "-0.04em", fontSize: `${textFontSize}px`, fontWeight: 600, lineHeight: "150%"}}
			   className="font-josefin-sans text-center">
				{text}
			</p>
			<WhiteSpace height={`${space}px`}/>
		</div>
	);
};
