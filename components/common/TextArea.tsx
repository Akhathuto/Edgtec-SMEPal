import React from 'react';
import Tooltip from './Tooltip';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
  tooltip?: string;
}

const TextArea: React.FC<TextAreaProps> = ({ label, id, className, tooltip, ...props }) => {
  return (
    <div>
      <div className="flex items-center mb-1">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {tooltip && (
            <Tooltip content={tooltip}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-gray-400 hover:text-gray-600 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </Tooltip>
        )}
      </div>
      <textarea
        id={id}
        rows={4}
        className={`form-input ${className}`}
        {...props}
      />
    </div>
  );
};

export default TextArea;