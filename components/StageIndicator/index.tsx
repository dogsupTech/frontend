import React, {FC} from 'react';
import { P1 } from "@/components/texts";

interface StageIndicatorProps {
	currentStage: number;
	totalStages: number;
	stageTitles: string[]; // Array of stage titles
	selectStage: (stage: number) => void;
}

const StageIndicator: FC<StageIndicatorProps> = ({currentStage, totalStages, stageTitles, selectStage}) => {
	return (
		<div className="flex flex-col min-w-[300px]">
			<div className="flex flex-col">
				{stageTitles.map((title, index) => (
					<div className="mb-2" key={index} onClick={() => selectStage(index + 1)}>
						<P1 color={currentStage === index + 1 ? "black" : "#B7B7B7"}>
                  <span
					  className={index < currentStage - 1 ? "line-through" : "" + (currentStage === index + 1 ? " underline" : "")
					  }> {title} </span>
						</P1>
					</div>
				))}
			</div>
		</div>
	);
};

export default StageIndicator;
