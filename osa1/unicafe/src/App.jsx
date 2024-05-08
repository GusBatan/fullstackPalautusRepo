import { useState } from 'react';

const StatisticsLine = ({ label, value }) => {
  return (
    <tr>
      <td>{label}</td>
      <td>{value}</td>
    </tr>
  );
};

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad;

  if (total === 0) {
    return (
      <div>
        <h2>No feedback given</h2>
      </div>
    );
  }
  return (
    <table>
      <tbody>
        <StatisticsLine label={'good'} value={good} />
        <StatisticsLine label={'neutral'} value={neutral} />
        <StatisticsLine label={'bad'} value={bad} />
        <StatisticsLine label={'average'} value={(good - bad) / total} />
        <StatisticsLine label={'positive'} value={(good / total) * 100} />
      </tbody>
    </table>
  );
};

const MyButton = ({ action, label }) => {
  return <button onClick={action}>{label}</button>;
};

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h2>give feedback</h2>
      <MyButton label={'good'} action={() => setGood(good + 1)} />
      <MyButton label={'neutral'} action={() => setNeutral(neutral + 1)} />
      <MyButton label={'bad'} action={() => setBad(bad + 1)} />
      <h2>Statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
