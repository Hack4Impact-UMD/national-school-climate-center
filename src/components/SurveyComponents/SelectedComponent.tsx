import React from "react";

interface SelectedComponentProps {
    label: string;
    onRemove: () => void;
}

const SelectedComponent: React.FC<SelectedComponentProps> = ({ label, onRemove }) => {
    return (
        <div className="flex items-center bg-[#f0f8fb] text-blue-700 border border-blue-300 rounded-2xl px-3 py-1 text-sm font-medium w-fit">
            <span>{label}</span>
            <button
                onClick={onRemove}
                className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none">
                    x
            </button>
            
       </div>
    );
};

export default SelectedComponent;