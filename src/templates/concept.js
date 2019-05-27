import React from 'react'

const concept = ({data}) => {
  return (
    <pre>
      {JSON.stringify(data, null, 2)}
    </pre>
  )
}

export default concept
