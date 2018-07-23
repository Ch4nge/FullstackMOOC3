import React from 'react'

const Person = (props) => {
  return(
    <tr>
      <td>{props.person.name}</td>
      <td>{props.person.number}</td>
      <td><button onClick={props.delete}>Poista</button></td>
    </tr>
  )
}

export default Person