import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTemplateResponses } from '../services/allAPI';

const ViewResponses = () => {
  const { id } = useParams();
  const [responses, setResponses] = useState([]);
  const [templateName, setTemplateName] = useState('');
  const [tableHeaders, setTableHeaders] = useState([]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await fetchTemplateResponses(id);

        const parsedResponses = res.data.responses.map(
          (response) => ({
            ...response,
            response_data: response.response_data,
          })
        );
        setResponses(parsedResponses);
        setTemplateName(res.data?.templateName || '');

        // Dynamically collect table headers
        const headers = new Set();
        parsedResponses.forEach((response) => {
          Object.keys(response.response_data).forEach((key) => {
            headers.add(key);
          });
        });
        setTableHeaders(Array.from(headers));
      } catch (error) {
        alert(
          error.response?.data?.error || 'Error fetching responses'
        );
      }
    };

    fetchResponses();
  }, [id]);

  if (!responses.length) {
    return <div>Loading or no responses available...</div>;
  }

  return (
    <div>
      <h1>Responses for "{templateName}"</h1>
      <table
        border="1"
        style={{ borderCollapse: 'collapse', width: '100%' }}
      >
        <thead>
          <tr>
            {tableHeaders.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {responses.map((response, index) => (
            <tr key={index}>
              {tableHeaders.map((header, idx) => {
                const value = response.response_data[header];
                // Handle nested object values (e.g., chk2)
                return (
                  <td key={idx}>
                    {typeof value === 'object' && value !== null
                      ? Object.entries(value)
                          .map(
                            ([key, val]) =>
                              `${key}: ${val ? 'Yes' : 'No'}`
                          )
                          .join(', ')
                      : value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewResponses;
