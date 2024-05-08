const Header = ({ course }) => <h1>{course.name}</h1>;

const Content = ({ course }) => {
  return (
    <>
      {course.parts.map((course) => (
        <p key={course.id}>
          {course.name} {course.exercises}
        </p>
      ))}
    </>
  );
};

const Total = ({ course }) => (
  <b>
    {`Number of exercises ${course.parts.reduce(
      (sum, part) => sum + part.exercises,
      0
    )}`}
  </b>
);

const Course = ({ course }) => (
  <>
    <Header course={course} />
    <Content course={course} />
    <Total course={course} />
  </>
);

export default Course;
