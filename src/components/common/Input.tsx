import React from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error,
  className = '',
  ...props 
}) => {
  return (
    <div className="input-wrapper">
      {label && <label className="input-label">{label}</label>}
      <input 
        className={`input ${error ? 'input--error' : ''} ${className}`.trim()}
        {...props} 
      />
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ 
  label, 
  error,
  className = '',
  ...props 
}) => {
  return (
    <div className="input-wrapper">
      {label && <label className="input-label">{label}</label>}
      <textarea 
        className={`input textarea ${error ? 'input--error' : ''} ${className}`.trim()}
        {...props} 
      />
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select: React.FC<SelectProps> = ({ 
  label, 
  error,
  options,
  className = '',
  ...props 
}) => {
  return (
    <div className="input-wrapper">
      {label && <label className="input-label">{label}</label>}
      <select 
        className={`input ${error ? 'input--error' : ''} ${className}`.trim()}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};
