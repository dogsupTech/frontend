import React, {useState} from "react";
import {useTranslation} from "next-i18next";
import { CustomAdieu, H4AndAHalf, H5, H7, P1 } from "@/components/texts";
import { PrimaryButton, WhiteSpace } from "@/components";
import StageIndicator from "@/components/StageIndicator";
import { CustomXORRadioButton } from "@/components/customXORRadioButton";
import { primaryColorTokens } from "@/components/tokens/color";

export const DogNameAndSex: React.FC<{
    isMobile: boolean,
    initDogName: string,
    initDogSex: string,
    onNext: (dogName: string, sex: string) => void
    currentStage?: number;
    selectStage?: (stage: number) => void;
    isEdit?: boolean;
    isSignup?: boolean;
}> = ({
          isMobile,
          onNext,
          isEdit,
          initDogSex,
          initDogName,
          selectStage,
          currentStage,
          isSignup
      }) => {
    const [dogName, setDogName] = useState<string>(initDogName);
    const [sex, setSex] = useState<string>(initDogSex);
    const [error, setError] = useState<string>("");

    const handleSubmit = () => {
        if ((dogName && dogName.length > 0) && sex) {
            onNext(dogName, sex);
            return;
        }
        setError("Please enter your dog's name and select sex");
    };

    const {t} = useTranslation()

    let cardFontSize = "32px"
    let cardFontWeight = 900
    let cardLineHeight = "105%"

    if (isMobile) {
        cardFontSize = "20px"
    }

    const nameTitleFirst = t('vetai.whatIsYourDogsName.title1')
    const nameTitleSecond = t('vetai.whatIsYourDogsName.title2')
    return (
        <div className={"flex flex-row"}>
            <div className="flex flex-col w-full items-center lg:w-[849px]">

                {!isMobile ? (
                    <H4AndAHalf
                        textAlign={"center"}>{nameTitleFirst} {nameTitleSecond}</H4AndAHalf>
                ) : (
                    <div className={"flex flex-col items-center"}>
                        <H5 textAlign={'center'}>{nameTitleFirst}</H5>
                        <H5 textAlign={'center'}>{nameTitleSecond}</H5>
                    </div>
                )}
                {isMobile ?
                    <WhiteSpace height={'44px'}/>
                    :
                    <WhiteSpace height={"63px"}/>
                }

                <DogNameInput
                    setDogName={setDogName}
                    dogNameSelected={dogName}
                    isMobile={isMobile}
                    placeHolder={t('vetai.whatIsYourDogsName.enterTheNameOfYourDog') || ''}
                />
                <WhiteSpace height={"30px"}/>
                <div
                    className={"flex p-[10px] flex-col w-full border max-w-[476px] rounded-[4px] border-black border-[2px]"}>
                    <H7>
                        {
                            t('vetai.whatIsYourDogsName.maleOrFemale')
                        }
                    </H7>
                    <CustomXORRadioButton
                        selectedOption={sex}
                        options={['male', 'female']}
                        onChange={setSex}
                    />
                </div>
                <WhiteSpace height={"30px"}/>

                {dogName &&
                    <CustomAdieu
                        color={primaryColorTokens.virgo}
                        fontSize={cardFontSize}
                        fontWeight={cardFontWeight}
                        lineHeight={cardLineHeight}
                    >
                        {t('vetai.whatIsYourDogsName.hello')}, {dogName}!
                    </CustomAdieu>
                }
                <WhiteSpace height={"50px"}/>
                {error &&
                    <>
                        <P1 color={primaryColorTokens.virgo}>{error}</P1>
                        <WhiteSpace height={"30px"}/>
                    </>
                }
                <PrimaryButton
                    isSmall
                    text={t('vetai.nextbutton') || ''}
                    onClick={handleSubmit}
                />
                <WhiteSpace height={"30px"}/>

            </div>
            {!isEdit || !isSignup &&
                <div className={"fixed hidden lg:block right-0 fixed top-0 right-0 mt-[300px]"}>
                    <StageIndicator
                        selectStage={selectStage!}
                        currentStage={currentStage!}
                        totalStages={6} // Increase the total number of stages
                        stageTitles={[
                            t('vetai.age'),
                            t('vetai.breed'),
                            t('vetai.symptoms'),
                            t('vetai.summary'),
                            t('vetai.assessment1'),
                            t('vetai.nextsteps1'),
                        ]}
                    />
                </div>}
        </div>
    );
}

const DogNameInput: React.FC<{
    isMobile: boolean
    placeHolder: string,
    dogNameSelected: string,
    setDogName: (dogName: string) => void
}> = (
    {
        isMobile,
        dogNameSelected,
        setDogName,
        placeHolder
    }) => {
    const inputHeight = isMobile ? "42px" : "81px"
    const fontSize = isMobile ? "16px" : "22px"
    const inputPaddingX = isMobile ? "22px" : "28px"

    const inputStyles = {
        fontSize: fontSize,
        fontFamily: 'Josefin Sans',
        height: inputHeight,
        width: '100%',
        cursor: 'pointer',
        background: 'transparent',
        color: "#878787",
        fontWeight: 600,
        lineHeight: "150%",
        letterSpacing: "-0.4px",
        borderRadius: "4px",
        border: "2px solid #000",
        padding: `0 ${inputPaddingX}`,
    }
    return (
        <div className="flex flex-row w-full">
            <input
                type="text"
                value={dogNameSelected}
                onChange={(e) => setDogName(e.target.value)}
                placeholder={placeHolder}
                // className="cursor-pointer focus:outline-none w-full bg-transparent font-josefin-sans"
                style={inputStyles}
            />
        </div>
    )
}

export default DogNameAndSex
