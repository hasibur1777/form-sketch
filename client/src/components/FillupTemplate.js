import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  fetchTemplateById,
  submitResponse,
} from '../services/allAPI';

const FillupTemplate = () => {
  const { id } = useParams();
  const [template, setTemplate] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchTemplateById(id)
      .then((res) => {
        setTemplate(res.data);
      })
      .catch((error) => {
        console.error('Error fetching template:', error);
      });
  }, [id]);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitResponse({
        template_id: id,
        response_data: formData,
      });
      alert('Form submitted successfully!');
      setFormData({});
    } catch (error) {
      alert('Error submitting form');
      console.error(error);
    }
  };

  if (!template) return <div>Loading...</div>;

  const parsedStructure = template.structure || {};
  const fields = parsedStructure.fields || [];

  return (
    <form onSubmit={handleSubmit}>
      <h2>{template.name}</h2>
      {fields.map((field) => (
        <div key={field.name} style={{ marginBottom: '20px' }}>
          <label>{field.label}</label>
          {field.type === 'text' && (
            <input
              type="text"
              placeholder={field.placeholder || ''}
              value={formData[field.name] || ''}
              onChange={(e) =>
                handleChange(field.name, e.target.value)
              }
              required
            />
          )}
          {field.type === 'email' && (
            <input
              type="email"
              placeholder={field.placeholder || ''}
              value={formData[field.name] || ''}
              onChange={(e) =>
                handleChange(field.name, e.target.value)
              }
              required
            />
          )}
          {field.type === 'textarea' && (
            <textarea
              placeholder={field.placeholder || ''}
              value={formData[field.name] || ''}
              onChange={(e) =>
                handleChange(field.name, e.target.value)
              }
              required
            ></textarea>
          )}
          {field.type === 'number' && (
            <input
              type="number"
              value={formData[field.name] || ''}
              onChange={(e) =>
                handleChange(field.name, e.target.value)
              }
              required
            />
          )}
          {field.type === 'dropdown' && (
            <select
              value={formData[field.name] || ''}
              onChange={(e) =>
                handleChange(field.name, e.target.value)
              }
              defaultValue={field.default || ''}
            >
              {field.options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
          {field.type === 'checkbox' &&
            field.options.map((option, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  id={`${field.name}_${index}`}
                  checked={formData[field.name]?.[option] || false}
                  value={option}
                  onChange={(e) =>
                    handleChange(field.name, {
                      ...formData[field.name],
                      [option]: e.target.checked,
                    })
                  }
                />
                <label htmlFor={`${field.name}_${index}`}>
                  {option}
                </label>
              </div>
            ))}
          {field.type === 'yesno' && (
            <div>
              <label>
                <input
                  type="radio"
                  name={field.name}
                  value="yes"
                  checked={formData[field.name] === 'yes'}
                  onChange={(e) =>
                    handleChange(field.name, e.target.value)
                  }
                  required
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name={field.name}
                  value="no"
                  checked={formData[field.name] === 'no'}
                  onChange={(e) =>
                    handleChange(field.name, e.target.value)
                  }
                  required
                />
                No
              </label>
            </div>
          )}
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

export default FillupTemplate;
