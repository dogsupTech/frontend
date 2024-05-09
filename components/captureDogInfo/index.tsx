import React, {useState} from "react";
import {useTranslation} from "next-i18next";
import { useAuth } from "@/components/auth/auth";
import { WhiteSpace } from "@/components";
import DogNameAndSex from "@/components/captureDogInfo/DogNameAndSex";
import HowOldIsYourDog from "@/components/howOldIsYourDog";
import BreedSelection from "@/components/breedSelection";
import { primaryColorTokens } from "@/components/tokens/color";
import { CustomProgressBar } from "@/components/customProgressBar";
import { BackArrow } from "@/components/icons";
import { useIsMobile } from "@/useIsMobile";


const sendSaveDogReqeust = async (dogData: DogData, idToken: string): Promise<Response> => {
    try {
        console.log(`got dog data`, dogData);
        const response = await fetch('/api/save-dog', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
                'Cache-Control': 'no-cache' // Add this line to prevent caching
            },
            body: JSON.stringify(dogData)
        });
        const data: Response = await response.json();
        console.log('API Response:', data);
        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error; // You can handle the error as needed
    }

}

interface DogData {
    dogName: string;
    sex: string;
    selectedBreed: string;
    birthDate: Date;
}

const CaptureDogInfo: React.FC<{ isMobile: boolean }> = () => {
    const [currentStage, setCurrentStage] = useState(1);
    const [dogName, setDogName] = useState("");
    const [sex, setSex] = useState<string>('');
    const [selectedBreed, setSelectedBreed] = useState('');
    const [birthDate, setBirthDate] = useState<Date | null>(null);
    const {idToken} = useAuth();
    const [loading, setLoading] = useState(false);
    const {t} = useTranslation()

	const isMobile = useIsMobile()
    const handleSubmit = async (dogName: string, sex: string, selectedBreed: string, birthDate: Date) => {
        if (!idToken) {
            console.error('ID Token not available.');
            return;
        }
        try {
            setLoading(true);
            const dog: DogData = {dogName, sex, selectedBreed, birthDate};

            const response = await sendSaveDogReqeust(dog, idToken);
            if (response.ok) {
                console.log('API Response:', response);
            }
        } catch (error) {
            console.error('API Request Error:', error);
            throw error; // You can handle the error as needed
        } finally {
            setLoading(false);
        }
    };

    const handleDogNameAndSex = (dogName: string, sex: string) => {
        setSex(sex)
        setDogName(dogName);
        nextStage();
    }

    const HandleAgeSelection = (birthDate: Date) => {
        setBirthDate(birthDate);
        nextStage();
    };

    const handleBreedSelectionAndSubmit = async (breed: string) => {
        try {
            console.log("in handleBreedSelectionAndSubmit",
                dogName,
                sex,
                breed,
                birthDate);

            setSelectedBreed(breed);

            if (!dogName || !sex || !breed || !birthDate) {
                alert("Not all set, :/")
                return
            }
            await handleSubmit(dogName, sex, selectedBreed, birthDate)
        } catch (e) {
            console.error('API Request Error:', e);
            alert("Error submitting dog info")
        }
    };

    const nextStage = () => {
        if (currentStage === 3) {
            alert('Submitting');
            return
        }
        setCurrentStage(currentStage + 1);
    };

    const selectStage = (stage: number) => {
        setCurrentStage(stage);
    }
    const handlePreviousStage = () => {
        if (currentStage <= 1) {
            setCurrentStage(1)
            return
        }
        setCurrentStage(currentStage - 1);
    };


    return (
        <div className={"flex w-full justify-center flex-row"}>
            <div className="flex flex-col w-full items-center w-[80%] lg:w-[849px]">
                <WhiteSpace height={"20px"}/>
                {currentStage > 1 && (
                    <BackArrow
                        handlePrevious={handlePreviousStage}
                        isMobile={isMobile}
                    />
                )}
                <WhiteSpace height={"50px"}/>
                <CustomProgressBar
                    value={(currentStage / 3 * 100)} // Adjust based on the number of stages
                    backgroundColor={primaryColorTokens.violet} // Customize the buffer color
                    bufferColor={primaryColorTokens.sugar} // Customize the progress color
                />
                <WhiteSpace height={"50px"}/>
                {currentStage === 1 && (
                    <DogNameAndSex
                        isMobile={isMobile}
                        selectStage={selectStage}
                        currentStage={currentStage}
                        onNext={handleDogNameAndSex}
                        initDogSex={sex}
                        initDogName={dogName}
                        isSignup={true}
                    />
                )}
                {currentStage === 2 && (
                    <HowOldIsYourDog
                        isSignup={true}
                        isMobile={isMobile}
                        selectStage={selectStage}
                        currentStage={currentStage}
                        onNext={HandleAgeSelection}/>
                )}
                {currentStage === 3 && (
                    <BreedSelection
                        isSignup={true}
                        isMobile={isMobile}
                        onNext={handleBreedSelectionAndSubmit}
                        initBreed={selectedBreed}
                        selectStage={selectStage}
                        currentStage={currentStage}
                    />
                )}
            </div>
        </div>
    )

}


export default CaptureDogInfo
