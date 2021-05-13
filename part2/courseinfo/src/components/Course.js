const Header = ({ course }) => {
    return (<h2>{course}</h2>)
  }
  const Part = ({ name, exercises }) => {
    return (<p>{name} {exercises}</p>)
  }
  const Content = ({ parts }) => {
    return (
      <div>
        {
          parts.map(x =>
            <Part
              key={x.id}
              name={x.name}
              exercises={x.exercises}
            />
          )
        }
      </div>
    )
  }
  const Total = ({ parts }) => {
    const total = parts.reduce(
      (sum, x) => sum + x.exercises, 0
    )
    return (
      <h3>
        total of {total} exercises
      </h3>
    )
  }
  
  const Course = ({ course }) => {
    return (
      <div>
        <Header
          course={course.name}
        />
        <Content
          parts={course.parts}
        />
        <Total
          parts={course.parts}
        />
      </div>
    )
  }

export default Course