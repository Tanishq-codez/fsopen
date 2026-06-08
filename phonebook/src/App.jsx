import { useEffect, useState } from 'react'
import nameService from "./services/names"
import axios from 'axios'
const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  
  useEffect(()=>{
   nameService.getAll().then(initialPerson => { 
        setPersons(initialPerson)
      })
  } ,[])
  const addPerson = (event) => {
    event.preventDefault()
    
    // Check if the name already exists in the phonebook
    const nameExists = persons.some(person => person.name.toLowerCase() === newName.toLowerCase())
    
  

    const personObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1 // Temporary ID generation before server implementation
    }

    
    if (nameExists) {
  const conf = window.confirm(`${newName} already exists, replace number?`)
  if (!conf) return
  
  const existingPerson = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())
  const updatedPerson = { ...existingPerson, number: newNumber }
  
  nameService.update(existingPerson.id, updatedPerson).then(returnedPerson => {
    setPersons(persons.map(p => p.id === existingPerson.id ? returnedPerson : p))
  })
  return
}
    nameService.create(personObject).then((response)=>{
      setPersons(persons.concat(response))
      setNewName('')
      setNewNumber('')
    })
    
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }
 const handleDel = (id)=>{
  const conf = window.confirm(`wana del ${id}`)
  if( conf){
    nameService.del(id)

    const newPerson = persons.filter((person)=> {
    return id !== person.id 
    })

    setPersons(newPerson)
  } 
  
 }
  // Filter the persons array based on the search input
  const personsToShow = filter === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with <input value={filter} onChange={handleFilterChange} />
      </div>

      <h3>Add a new</h3>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h3>Numbers</h3>
      <ul>
        {personsToShow.map(person => 
          <li key={person.id}> {person.name} {person.number} 
          <button onClick={()=>handleDel(person.id)}>delete</button>
          </li>
          
        )}
      </ul>
    </div>
  )
}

export default App