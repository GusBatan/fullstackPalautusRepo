import Part from './Part';
import { CoursePart } from '../courseParts';

interface ContentProps {
  courseParts: CoursePart[];
}

const Content = (props: ContentProps) => {
  const { courseParts } = props;
  return (
    <>
      {courseParts.map((part) => (
        <Part key={part.name} coursePart={part} />
      ))}
    </>
  );
};

export default Content;
