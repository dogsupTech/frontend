import { app } from './firebase';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, User as firebaseUser } from 'firebase/auth';
import { useEffect, useState } from "react";
import { z } from "zod";

class User {
	uid: string;
	email: string;
	firstName: string | undefined;
	lastName: string | undefined;
	phoneNumber: string | undefined;
	emailActivationToken: string | undefined;
	email_verified: boolean = false;
	updatedAt: Date | null = null; // initialize to null
	vet_ai_waitlist: boolean = false;
	vet_ai_is_white_listed: boolean = false;
	dog: Dog | null = null;

	constructor(email: string, uid: string) {
		this.uid = uid;
		this.email = email;
	}
}


class Dog {
	name: string = "";
	sex: string = ""; // m for male and f for w
	breed: string = "";
	birthDate: Date | null = null // can be used to calculate age
	constructor(name: string, sex: string, breed: string, birthDate: Date) {
		this.name = name;
		this.sex = sex;
		this.breed = breed;
		this.birthDate = birthDate;
	}
}


// Updated `getMe` function
async function getMe(idToken: string): Promise<User | null> {
	try {
		const response = await fetch("/api/me", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${idToken}`,
			},
		});

		if (!response.ok) {
			throw new Error(`Error fetching user data: ${response.statusText}`);
		}

		const userData = await response.json();
		console.log("userData", userData);
		return userData.user; // Assuming the response JSON structure matches the 'User' type
	} catch (error) {
		console.error("Error in getMe:", error);
		return null;
	}
}

export const useAuth = () => {
	const auth = getAuth(app);
	const [user, setUser] = useState<firebaseUser | null>(null);
	const [idToken, setIdToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [userData, setUserData] = useState<User | null>(null); // Define userData state
	const [isUserDataLoading, setIsUserDataLoading] = useState(false);

	const fetchUserData = async (token: string) => {
		setIsUserDataLoading(true);
		try {
			const fetchedUserData = await getMe(token); // Assume getMe is your API call to fetch user data
			setUserData(fetchedUserData);
		} catch (error) {
			console.error("Error fetching user data:", error);
		} finally {
			setIsUserDataLoading(false);
		}
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			setIsLoading(true);
			setUser(firebaseUser);
			if (firebaseUser) {
				try {
					const token = await firebaseUser.getIdToken();
					setIdToken(token);
					setIsUserDataLoading(true);
					const userData = await getMe(token);
					console.log("what", userData)
					setUserData(userData);
				} catch (error) {
					console.error("Error during ID token fetch or user data fetch:", error);
				} finally {
					setIsUserDataLoading(false);
				}
			} else {
				setIdToken(null);
				setUserData(null);
			}
			setIsLoading(false);
		});
		return () => unsubscribe();
	}, [auth]);

	// Function to manually refresh or update userData
	const refreshUserData = async () => {
		if (idToken) {
			await fetchUserData(idToken);
		}
	};

	return {user, auth, isLoading, idToken, userData, isUserDataLoading, refreshUserData};
};

export function useAuthLogic() {
	const loginFirebase = async (username: string, password: string) => {
		const auth = getAuth(app);
		const userCredentials = await signInWithEmailAndPassword(auth, username, password);
		return userCredentials; // Return the Firebase UserCredential object
	};

	const login = async (username: string, password: string) => {
		try {
			console.log("logging in username", username)
			const auth = getAuth(app);
			console.log("auth", auth)
			const userCredentials = await signInWithEmailAndPassword(auth, username, password);
			return userCredentials; // Return the Firebase UserCredential object
		} catch (error) {
			console.error("Login error:", error);
			throw error;
		}
	}

	const logout = async (): Promise<void> => {
		try {
			const auth = getAuth(app);
			await signOut(auth);
			console.log('User logged out.');
		} catch (error) {
			console.error("Logout error:", error);
			throw error;
		}
	}


	return {login, logout, loginFirebase};
}

export default useAuthLogic;
//  signup
// Define validation schema using zod

const invalid_type_error = 'Invalid type provided for this field';
const required_error = 'This field cannot be blank';

export const completeSignupSchema = z.object({
	email: z
		.string({invalid_type_error, required_error})
		.email()
		.min(1, 'Value is too short'),
	password: z
		.string({invalid_type_error})
		.min(6, 'Password is too short'),
	firstName: z
		.string({invalid_type_error, required_error})
		.min(1, 'Value is to short'),
	lastName: z
		.string({invalid_type_error, required_error})
		.min(1, 'Value is to short'),
	phoneNumber: z.string().regex(/^\d*$/, {message: "Please enter only numbers for the phone number"}).optional(),
});

export type CompleteSignUpSchemaType = z.infer<typeof completeSignupSchema>;


export const completeForgotPasswordSchema = z.object({
	password: z
		.string({invalid_type_error, required_error})
		.min(6, 'Password is too short'),
	repeatPassword: z
		.string({invalid_type_error, required_error})
}).refine((data) => data.password === data.repeatPassword, {
	message: "Passwords don't match",
	path: ["repeatPassword"], // path of error
});

export type CompleteForgotPasswordSchemaType = z.infer<typeof completeForgotPasswordSchema>;


