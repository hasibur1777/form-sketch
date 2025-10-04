import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchTemplateById,
  submitResponse,
} from '../services/allAPI';
import {
  Box,
  FormControl,
  TextField,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormLabel,
  Radio,
  RadioGroup,
  Button,
} from '@mui/material';

const FillupTemplate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchTemplateById(id)
      .then((res) => {
        if (!res.data.structure || !res.data.structure.fields) {
          throw new Error('Invalid template structure');
        }
        setTemplate(res.data);
        setError(null);
      })
      .catch((error) => {
        console.error('Error fetching template:', error);
        if (error.response?.status === 403) {
          setError('You do not have access to this form');
        } else if (error.response?.status === 404) {
          setError('Form not found');
        } else {
          setError(
            error.message ||
              'An error occurred while loading the form'
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      await submitResponse({
        template_id: id,
        response_data: formData,
        q_structure: template.structure,
      });
      setError(null);
      navigate('/home');
    } catch (error) {
      setError(
        error.response?.data?.error || 'Error submitting form'
      );
    } finally {
      setSubmitLoading(false);
      console.error(error);
    }
  };

  if (!template) return <div>Loading...</div>;

  const parsedStructure = template.structure || {};
  const fields = parsedStructure.fields || [];

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
      <form onSubmit={handleSubmit}>
        <FormControl>
          <h2>{template.name}</h2>
          {fields.map((field) => (
            <FormGroup key={field.id}>
              {/* <label>{field.label}</label> */}
              {(field.type === 'text' ||
                field.type === 'email' ||
                field.type === 'number') && (
                <TextField
                  label={field.label}
                  type={field.type}
                  fullWidth
                  margin="normal"
                  value={formData[field.id] || ''}
                  onChange={(e) =>
                    handleChange(field.id, e.target.value)
                  }
                  variant="standard"
                  required
                />
              )}
              {field.type === 'textarea' && (
                <TextField
                  label={field.label}
                  type={field.type}
                  fullWidth
                  margin="normal"
                  value={formData[field.id] || ''}
                  onChange={(e) =>
                    handleChange(field.id, e.target.value)
                  }
                  multiline
                  rows={4}
                  required
                />
              )}
              {field.type === 'dropdown' && (
                <TextField
                  select
                  label={field.label}
                  defaultValue=""
                  // helperText="Please select"
                  value={formData[field.id] || ''}
                  onChange={(e) =>
                    handleChange(field.id, e.target.value)
                  }
                >
                  {field.options.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              )}
              {field.type === 'checkbox' && (
                <FormLabel
                  component="legend"
                  sx={{
                    marginTop: 2,
                    marginBottom: 2,
                  }}
                >
                  {field.label}
                  <FormGroup
                    sx={{ border: 1, borderRadius: 1, padding: 1 }}
                  >
                    {field.options.map((option, index) => (
                      <div key={index}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={
                                formData[field.id]?.[option] || false
                              }
                              onChange={(e) =>
                                handleChange(field.id, {
                                  ...formData[field.id],
                                  [option]: e.target.checked,
                                })
                              }
                            />
                          }
                          label={option}
                        />
                      </div>
                    ))}
                  </FormGroup>
                </FormLabel>
              )}
              {field.type === 'yesno' && (
                <FormGroup
                  sx={{
                    marginTop: 2,
                    marginBottom: 2,
                  }}
                >
                  <FormLabel>{field.label}</FormLabel>
                  <RadioGroup
                    defaultValue=""
                    name={field.id}
                    value={formData[field.id] || ''}
                    onChange={(e) =>
                      handleChange(field.id, e.target.value)
                    }
                  >
                    <FormControlLabel
                      value="yes"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormGroup>
              )}
            </FormGroup>
          ))}
          <Button variant="contained" type="submit" color="success">
            Submit
          </Button>
        </FormControl>
      </form>
    </Box>
  );
};

export default FillupTemplate;
