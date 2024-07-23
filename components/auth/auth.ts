import { app } from './firebase';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, User as firebaseUser } from 'firebase/auth';
import { useEffect, useState } from "react";

class User {
	uid: string;
	email: string;
	name: string

	constructor(email: string, uid: string, name:string) {
		this.uid = uid;
		this.email = email;
		this.name = name
	}
}

async function getMe(idToken: string): Promise<User | null> {
	try {
		const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/me"!, {
			method: "GET",
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

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			console.log("state changed")
			setIsLoading(true);
			if (firebaseUser) {
				try {
					setUser(firebaseUser);
					const token = await firebaseUser.getIdToken();
					setIdToken(token);
					const userData = await getMe(token);
					setUserData(userData);
					setIsLoading(false);
					return
				} catch (error) {
					console.error("Error during ID token fetch or user data fetch:", error);
				}
			}
			setIdToken(null);
			setUserData(null);
			setIsLoading(false);
		});
		return () => unsubscribe();
	}, [auth]);

	return {user, auth, isLoading, idToken, userData};
};

export function useAuthLogic() {
	const loginFirebase = async (username: string, password: string) => {
		const auth = getAuth(app);
		const userCredentials = await signInWithEmailAndPassword(auth, username, password);
		return userCredentials; // Return the Firebase UserCredential object
	};

	const login = async (username: string, password: string) => {
		try {
			const auth = getAuth(app);
			const userCredentials = await signInWithEmailAndPassword(auth, username, password);
			alert(userCredentials)
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


