import Content from "./components/Content";
import Header from "./components/Header";
import Total from "./components/Total";
import {courseParts} from './courseParts';


const App = () => {
  const courseName = "Half Stack application development"

  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  return (
    <div>
      <Header name={courseName} />
      <Content courseParts={courseParts}/>
      <Total total={totalExercises} />
    </div>
  );
};

export default App;