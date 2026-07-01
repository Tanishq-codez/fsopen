import { useEffect, useState } from "react";
import nameService from "./services/names";
import Notification from "./components/Notifications";

const App = () => {
  const [persons, setPersons] = useState(null);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMsg] = useState("");

  useEffect(() => {
    nameService.getAll().then((initialPerson) => {
      setPersons(initialPerson);
    });
  }, []);

  if (!persons) {
    return <div>loading.....</div>;
  }

  const addPerson = (event) => {
    event.preventDefault();

    const nameExists = persons.some(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    );

    // ✅ Cleaned up: No hardcoded 'id' property here
    const personObject = {
      name: newName,
      number: newNumber,
    };

    if (nameExists) {
      const conf = window.confirm(`${newName} already exists, replace number?`);
      if (!conf) return;

      const existingPerson = persons.find(
        (p) => p.name.toLowerCase() === newName.toLowerCase()
      );
      const updatedPerson = { ...existingPerson, number: newNumber };

      nameService
        .update(existingPerson.id, updatedPerson)
        .then((returnedPerson) => {
          setPersons(
            persons.map((p) =>
              p.id === existingPerson.id ? returnedPerson : p
            )
          );
          setMsg(`Updated number for ${returnedPerson.name}`);
          setNewName("");     // ✅ Reset inputs on successful update
          setNewNumber("");   // ✅ Reset inputs on successful update
          setTimeout(() => setMsg(null), 3000);
        })
        .catch((error) => {
          setMsg(
            error.response?.data?.error || error.message || "Request failed"
          );
          setTimeout(() => setMsg(null), 3000);
        });
      return;
    }
    nameService
      .create(personObject)
      .then((response) => {
        setPersons(persons.concat(response));
        setMsg(`Added ${response.name}`);
        setNewName("");
        setNewNumber("");
        setTimeout(() => setMsg(null), 3000);
      })
      .catch((error) => {
        // ✅ Catches Mongoose validation errors perfectly
        
        console.log(error.response?.data?.error || error.message || "Request failed")
        setMsg(
          error.response?.data?.error || error.message || "Request failed"
        );
        setTimeout(() => setMsg(null), 3000);
      });
  };

  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleFilterChange = (event) => setFilter(event.target.value);

  const handleDel = (id) => {
    const personToDel = persons.find((p) => p.id === id);
    if (!personToDel) return;

    const conf = window.confirm(`Delete ${personToDel.name}?`);
    if (conf) {
      nameService
        .del(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          setMsg(`Deleted ${personToDel.name}`);
          setTimeout(() => setMsg(null), 3000);
        })
        .catch((error) => {
          setMsg(error.message || "Unable to delete person");
          setTimeout(() => setMsg(null), 3000);
        });
    }
  };

  const personsToShow =
    filter === ""
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(filter.toLowerCase())
        );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
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
        {personsToShow.map((person) => (
          <li className="note" key={person.id}>
            {person.name} {person.number}
            <button onClick={() => handleDel(person.id)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;