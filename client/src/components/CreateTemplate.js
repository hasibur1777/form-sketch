import React, { useState } from 'react';
import { createTemplate } from '../services/allAPI';

const CreateTemplate = () => {
  const [name, setName] = useState('');
  const [fields, setFields] = useState([]);
  const [fieldDetails, setFieldDetails] = useState({
    name: '',
    label: '',
    type: 'text', // Default field type
    options: '', // For dropdown and checkbox
  });

  const addField = () => {
    if (!fieldDetails.name || !fieldDetails.label) {
      alert('Field Name and Label are required!');
      return;
    }

    const newField = {
      name: fieldDetails.name,
      label: fieldDetails.label,
      type: fieldDetails.type,
    };

    // Add options for dropdown or checkbox
    if (
      fieldDetails.type === 'dropdown' ||
      fieldDetails.type === 'checkbox'
    ) {
      newField.options = fieldDetails.options
        .split(',')
        .map((opt) => opt.trim());
    }

    setFields([...fields, newField]);
    setFieldDetails({
      name: '',
      label: '',
      type: 'text',
      options: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTemplate({
        name,
        structure: JSON.stringify({ fields }),
      });
      alert('Template created successfully!');
      setName('');
      setFields([]);
    } catch (error) {
      alert(error.response.data?.error || 'Error creating template');
    }
  };

  return (
    <div>
      <h2>Create New Template</h2>
      <form onSubmit={handleSubmit}>
        {/* Template Name */}
        <input
          type="text"
          placeholder="Template Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Add Fields */}
        <div>
          <h3>Add Field</h3>
          <input
            type="text"
            placeholder="Field Short Code (unique identifier)"
            value={fieldDetails.name}
            onChange={(e) =>
              setFieldDetails({
                ...fieldDetails,
                name: e.target.value,
              })
            }
            required
          />
          <input
            type="text"
            placeholder="Field Name (display name)"
            value={fieldDetails.label}
            onChange={(e) =>
              setFieldDetails({
                ...fieldDetails,
                label: e.target.value,
              })
            }
            required
          />
          <select
            value={fieldDetails.type}
            onChange={(e) =>
              setFieldDetails({
                ...fieldDetails,
                type: e.target.value,
              })
            }
          >
            <option value="text">Text</option>
            <option value="email">Email</option>
            <option value="number">Number</option>
            <option value="textarea">Text Area</option>
            <option value="dropdown">Dropdown</option>
            <option value="checkbox">Checkbox</option>
            <option value="yesno">Yes/No</option>
          </select>
          {['dropdown', 'checkbox'].includes(fieldDetails.type) && (
            <input
              type="text"
              placeholder="Options (comma-separated)"
              value={fieldDetails.options}
              onChange={(e) =>
                setFieldDetails({
                  ...fieldDetails,
                  options: e.target.value,
                })
              }
            />
          )}
          <button type="button" onClick={addField}>
            Add Field
          </button>
        </div>

        {/* Field Preview */}
        <h3>Field Preview</h3>
        <ul>
          {fields.map((field, index) => (
            <li key={index}>
              <strong>{field.label}</strong> ({field.type})
              {field.options && (
                <span> - Options: {field.options.join(', ')}</span>
              )}
            </li>
          ))}
        </ul>

        {/* Submit Template */}
        <button type="submit">Create Template</button>
      </form>
    </div>
  );
};

export default CreateTemplate;
