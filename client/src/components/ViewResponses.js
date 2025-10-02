import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTemplateResponses } from '../services/allAPI';

const ViewResponses = () => {
  const { id } = useParams();
  const [mergedFields, setMergedFields] = useState([]);
  const [templateName, setTemplateName] = useState('');
  const [responsesCount, setResponsesCount] = useState(0);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await fetchTemplateResponses(id);
        setMergedFields(res.data.mergedFields || []);
        setTemplateName(res.data?.templateName || '');
        setResponsesCount(res.data?.responsesCount || 0);
      } catch (error) {
        alert(
          error.response?.data?.error || 'Error fetching responses'
        );
      }
    };

    fetchResponses();
  }, [id]);

  if (!mergedFields.length) {
    return <div>Loading or no responses available...</div>;
  }

  // Build table header from mergedFields labels
  const headers = mergedFields.map((f) => f.label);
  const rowCount = responsesCount;

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>
        Responses for{' '}
        <span style={{ color: '#2c3e50' }}>{templateName}</span>
      </h1>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '1px solid #ddd',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#f4f6f8' }}>
            {headers.map((header, idx) => (
              <th
                key={idx}
                style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                  textAlign: 'left',
                  fontWeight: 'bold',
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rowCount }).map((_, rowIdx) => (
            <tr
              key={rowIdx}
              style={{
                backgroundColor: rowIdx % 2 ? '#fafafa' : 'white',
              }}
            >
              {mergedFields.map((field, colIdx) => {
                let value = field.values[rowIdx];

                // Handle checkbox/objects nicely
                if (typeof value === 'object' && value !== null) {
                  value = Object.entries(value)
                    .filter(([_, v]) => v)
                    .map(([k]) => k)
                    .join(', ');
                }

                return (
                  <td
                    key={colIdx}
                    style={{
                      padding: '8px',
                      border: '1px solid #ddd',
                    }}
                  >
                    {value || '-'}
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
