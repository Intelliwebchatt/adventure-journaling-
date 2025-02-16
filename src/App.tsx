import React, { useState, useEffect } from 'react';

function App() {
  const [text, setText] = useState('');
  const [media, setMedia] = useState<FileList | null>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [location, setLocation] = useState<{ latitude: number | null, longitude: number | null }>({ latitude: null, longitude: null });

  useEffect(() => {
    loadEntries();
    getLocation();
  }, []);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const loadEntries = async () => {
    const db = await openDatabase();
    const storedEntries = await getAllEntries(db);
    setEntries(storedEntries);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setMedia(event.target.files);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const db = await openDatabase();
    await saveEntry(db, { text, media, location });
    await loadEntries();
    setText('');
    setMedia(null);
    getLocation(); // Refresh location for the next entry
  };

  const openDatabase = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open('journalDB', 1);

      request.onerror = () => {
        reject('Database failed to open');
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBRequest).result as IDBDatabase;
        const objectStore = db.createObjectStore('entries', { autoIncrement: true });
        objectStore.createIndex('text', 'text', { unique: false });
        objectStore.createIndex('media', 'media', { unique: false });
        objectStore.createIndex('latitude', 'location.latitude', { unique: false }); // Index for latitude
        objectStore.createIndex('longitude', 'location.longitude', { unique: false }); // Index for longitude
      };
    });
  };

  const saveEntry = async (db: IDBDatabase, entry: { text: string, media: FileList | null, location: { latitude: number | null, longitude: number | null } }) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['entries'], 'readwrite');
      const objectStore = transaction.objectStore('entries');
      const request = objectStore.add(entry);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject('Entry failed to add');
      };
    });
  };

  const getAllEntries = async (db: IDBDatabase): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['entries'], 'readonly');
      const objectStore = transaction.objectStore('entries');
      const request = objectStore.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject('Entries failed to retrieve');
      };
    });
  };


  return (
    <div className="container">
      <h1>Journaling App</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <textarea
            id="journal-text"
            placeholder="Write your journal entry here"
            value={text}
            onChange={handleTextChange}
          />
        </div>
        <div className="form-group">
          <input type="file" id="media-upload" multiple onChange={handleMediaChange} />
        </div>
        {location.latitude && location.longitude && (
          <div className="location-info">
            <p>Latitude: {location.latitude}</p>
            <p>Longitude: {location.longitude}</p>
          </div>
        )}
        <button type="submit">Save Entry</button>
      </form>

      <div className="entries-container">
        <h2>Journal Entries</h2>
        {entries.map((entry: any, index: number) => (
          <div key={index} className="entry">
            <p>{entry.text}</p>
             {entry.media && entry.media.length > 0 && (
              <div>
                <h3>Media:</h3>
                {/* Media display logic would go here - needs more complex handling for files */}
                <p>Media attached (display logic to be implemented)</p>
              </div>
            )}
             {entry.location && entry.location.latitude && entry.location.longitude && (
              <div className="location-info">
                <p>Latitude: {entry.location.latitude}</p>
                <p>Longitude: {entry.location.longitude}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
