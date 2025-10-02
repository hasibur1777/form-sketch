import React, { useState } from 'react';
import { createTemplate } from '../services/allAPI';
import {
  Box,
  FormControl,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';

const CreateTemplate = () => {
  const [name, setName] = useState('');
  const [fields, setFields] = useState([]);
  const [fieldDetails, setFieldDetails] = useState({
    label: '',
    type: 'text', // Default field type
    options: '', // For dropdown and checkbox
  });

  const generateFieldId = () => {
    // Get the next ID based on fields length + 1
    const nextId = fields.length + 1;
    return `field_${nextId}`;
  };

  const addField = () => {
    if (!fieldDetails.label) {
      alert('Field Label is required!');
      return;
    }

    const newField = {
      id: generateFieldId(),
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
    <Box
      sx={{
        maxWidth: 640,
        margin: 'auto',
        backgroundColor: 'white',
        padding: 4,
        boxShadow: 3,
        borderRadius: 2,
        marginTop: 2,
      }}
    >
      <Box
        sx={{
          marginLeft: 5,
        }}
      >
        <h2>Create New Template</h2>
        <form onSubmit={handleSubmit}>
          <FormControl>
            <TextField
              label="Template Name"
              type="text"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="standard"
              required
            />

            <div>
              <h3>Add Field</h3>

              <TextField
                label="Field Name (display name)"
                type="text"
                fullWidth
                value={fieldDetails.label}
                onChange={(e) =>
                  setFieldDetails({
                    ...fieldDetails,
                    label: e.target.value,
                  })
                }
                variant="standard"
                required
              />

              <TextField
                sx={{ marginTop: 1, marginBottom: 1 }}
                select
                label="Type"
                defaultValue=""
                value={fieldDetails.type}
                onChange={(e) =>
                  setFieldDetails({
                    ...fieldDetails,
                    type: e.target.value,
                  })
                }
              >
                <MenuItem value={'text'}>Text</MenuItem>
                <MenuItem value={'email'}>Email</MenuItem>
                <MenuItem value={'number'}>Number</MenuItem>
                <MenuItem value={'textarea'}>Text Area</MenuItem>
                <MenuItem value={'dropdown'}>Dropdown</MenuItem>
                <MenuItem value={'checkbox'}>Checkbox</MenuItem>
                <MenuItem value={'yesno'}>Yes/No</MenuItem>
              </TextField>

              {['dropdown', 'checkbox'].includes(
                fieldDetails.type
              ) && (
                <TextField
                  label="Options (comma-separated)"
                  type="text"
                  fullWidth
                  value={fieldDetails.options}
                  onChange={(e) =>
                    setFieldDetails({
                      ...fieldDetails,
                      options: e.target.value,
                    })
                  }
                  variant="standard"
                />
              )}

              <br></br>
              <Button
                variant="contained"
                type="button"
                onClick={addField}
                sx={{ marginTop: 1 }}
              >
                Add Field
              </Button>
            </div>

            <h3>Field Preview</h3>
            <ul>
              {fields.map((field, index) => (
                <li key={index}>
                  <strong>{field.label}</strong> ({field.type})
                  {field.options && (
                    <span>
                      {' '}
                      - Options: {field.options.join(', ')}
                    </span>
                  )}
                </li>
              ))}
            </ul>

            <Button variant="contained" type="submit" color="success">
              Create Template
            </Button>
          </FormControl>
        </form>
      </Box>
    </Box>
  );
};

export default CreateTemplate;
