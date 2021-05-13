const Persons = ({ persons, handleDelete }) => {
  return (
    persons.map(p => 
      <p key={p.name}>{p.name} {p.number}  
          <button onClick={()=>handleDelete(p.id)}>delete</button>
      </p>
    )
  )
}

export default Persons