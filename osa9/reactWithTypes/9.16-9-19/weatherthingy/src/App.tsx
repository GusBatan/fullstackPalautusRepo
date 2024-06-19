import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import {
  DiaryEntry,
  NewDiaryEntry,
  Weather,
  Visibility,
  ValidationError,
} from './types/types';

const ADDRESS = 'http://localhost:3000/api/diaries';

const App = () => {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const weatherTypes = ['sunny', 'rainy', 'cloudy', 'stormy', 'windy'];
  const visibilityLevels = ['great', 'good', 'ok', 'poor'];

  const [newEntry, setNewEntry] = useState<NewDiaryEntry>({
    date: '',
    weather: 'sunny',
    visibility: 'great',
    comment: '',
  });

  useEffect(() => {
    const fetchDiaryEntries = async () => {
      try {
        const response = await axios.get<DiaryEntry[]>(ADDRESS);
        setDiaryEntries(response.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        if (axios.isAxiosError<ValidationError, Record<string, unknown>>(err)) {
          setError('Failed to fetch diary entries');
        } else {
          setError('Unknown error occurred');
        }
      }
    };

    fetchDiaryEntries();
  }, []);

  const handleInput = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setNewEntry((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'weather' && weatherTypes.includes(value)) {
      setNewEntry((prevState) => ({
        ...prevState,
        weather: value as Weather,
      }));
    } else if (name === 'visibility' && visibilityLevels.includes(value)) {
      setNewEntry((prevState) => ({
        ...prevState,
        visibility: value as Visibility,
      }));
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post<DiaryEntry>(ADDRESS, newEntry);
      setDiaryEntries((prevEntries) => [...prevEntries, response.data]);
      setNewEntry({
        date: '',
        weather: 'sunny',
        visibility: 'great',
        comment: '',
      });
    } catch (err) {
      if (axios.isAxiosError<ValidationError, Record<string, unknown>>(err)) {
        setError('Failed to add new diary entry');
      } else {
        setError('Unexpected error occurred');
      }
    }
  };

  if (error) {
    return <div>error {error}</div>;
  }

  if (loading) {
    return <div>loading</div>;
  }

  return (
    <div>
      <h1>Diary Entries</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <h2>Date:</h2>
          <input
            type='date'
            name='date'
            value={newEntry.date}
            onChange={handleInput}
            required
          />
        </div>
        <div>
          <h2>Weather:</h2>
          <div>
            {weatherTypes.map((type) => (
              <label key={type}>
                <input
                  onChange={handleChange}
                  type='radio'
                  value={type}
                  checked={newEntry.weather === type}
                />
                {type}
              </label>
            ))}
          </div>
        </div>
        <div>
          <h2>Visibility:</h2>
          <div>
            {visibilityLevels.map((type) => (
              <label key={type}>
                <input
                  onChange={handleChange}
                  type='radio'
                  value={type}
                  checked={newEntry.visibility === type}
                />
                {type}
              </label>
            ))}
          </div>
        </div>
        <div>
          <h2>Comment:</h2>
          <textarea value={newEntry.comment} onChange={handleInput} />
        </div>
        <button type='submit'>Add</button>
      </form>
      <h2>Diart entries</h2>
      <ul>
        {diaryEntries.map((entry) => (
          <li key={entry.id}>
            <p>
              <b>Date:</b> {entry.date}
            </p>
            <p>
              <b>Weather:</b> {entry.weather}
            </p>
            <p>
              <b>Visibility:</b> {entry.visibility}
            </p>
            {entry.comment && <p>Comment: {entry.comment}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
