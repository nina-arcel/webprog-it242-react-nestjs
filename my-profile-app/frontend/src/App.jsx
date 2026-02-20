import React, { useState, useEffect } from 'react';
import { getGuestbookEntries, createGuestbookEntry } from './api/api';
import './form.css';

function App() {
  const [entries, setEntries] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const data = await getGuestbookEntries();
      setEntries(data);
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    
    try {
      await createGuestbookEntry({ name, message });
      setName('');
      setMessage('');
      loadEntries();
    } catch (error) {
      console.error('Error creating entry:', error);
    }
  };

  return (
    <div className="container">
      <h1 className="Cal-text">Guestbook</h1>
      
      <div id="app">
        <form onSubmit={handleSubmit}>
          <p>
            <label>Name:<br />
              <input 
                type="text" 
                required 
                placeholder="Your name.." 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          </p>

          <p>
            <label>Message:<br />
              <textarea 
                rows="3" 
                placeholder="Write your message.." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </label>
          </p>

          <button type="submit">Sign Guestbook</button>
        </form>

        {entries.length > 0 && (
          <>
            <hr />
            <div>
              <p><strong>Recent Guestbook Entries:</strong></p>
              <ul>
                {entries.map((entry) => (
                  <li key={entry.id}>
                    <strong>{entry.name}</strong>
                    <br />
                    <small>{entry.message}</small>
                    <br />
                    <small style={{ color: '#999' }}>
                      {new Date(entry.created_at).toLocaleString()}
                    </small>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;