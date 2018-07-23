import React from 'react'

const Input = (props) => {
  return(
    <div>
      {props.text} <input name={props.name} value={props.value} onChange={props.onChange}/>
    </div>
  )
}

export default Input