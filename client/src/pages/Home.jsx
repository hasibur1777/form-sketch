import React, { useState, useEffect } from 'react';
import { fetchAllTemplates } from '../services/allAPI';
import { Link } from 'react-router-dom';

const Home = () => {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    fetchAllTemplates().then((res) => setTemplates(res.data));
  }, []);

  return (
    <div>
      <h1>Available Templates</h1>

      <li>
        <Link to="/create-template">Create New Template</Link>
      </li>

      <ul>
        {templates.map((template) => (
          <li key={template.id}>
            {template.name} -{' '}
            <Link to={`/fillup-template/${template.id}`}>
              Fill Form
            </Link>{' '}
            |{' '}
            <Link to={`/template/${template.id}/responses/`}>
              View Responses
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
