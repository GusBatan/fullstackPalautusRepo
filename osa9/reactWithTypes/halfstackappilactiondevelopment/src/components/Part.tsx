import { CoursePart } from '../courseParts';

interface PartProps {
  coursePart: CoursePart;
}

const Part = (props: PartProps) => {
  const { coursePart } = props;
  const renderContent = () => {
    switch (coursePart.kind) {
      case 'basic':
        return (
          <div>
            <b>{coursePart.description}</b>
          </div>
        );
      case 'group':
        return <p>{`project exercises: ${coursePart.groupProjectCount}`}</p>;
      case 'background':
        return (
          <div>
            <b>{coursePart.description}</b>
            <p>{`see: ${coursePart.backgroundMaterial}`}</p>
          </div>
        );
      case 'special':
        return (
          <div>
            <b>{coursePart.description}</b>
            <p>{`required skills: ${coursePart.requirements.join(', ')}`}</p>
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div>
      <div>
        <p>{`${coursePart.name} ${coursePart.exerciseCount}`}</p>
      </div>
      {renderContent()}
    </div>
  );
};

export default Part;
