import React, { useState } from "react";

interface DropdownMenuProps {
    label:string;
    options?: string[];
    color?: string;
    onSelect: (option: string) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
    label,
    options = ["School", "Respondent Group", "Compare By", "Question Type", "Survey Type"],
    color = "#f0f8fb",
    onSelect,   
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(label);

    const handleOptionClick = (option: string) => {
        setSelectedOption(option);
        onSelect(option);
        setIsOpen(false);
    };
    
    return (
        <div className="relative inline-block text-left">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex justify-center w-full rounded-2xl px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                style={{ backgroundColor: color }}
            >
                {selectedOption}
                <svg
                    className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
            </button>
            {isOpen && (
                <div
                    className="absolute left-0 mt-2 w-28 bg-white border border-gray-200 rounded-md shadow-md z-10">
                    {options.map((option) => (
                        <button
                            key={option}
                            onClick={() => handleOptionClick(option)}
                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm rounded-xl"
                        >
                            {option}
                        </button>))}
                    </div>
            )}
        </div>
    );
};

export default DropdownMenu;