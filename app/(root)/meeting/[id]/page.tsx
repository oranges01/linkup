import React from 'react'

const Meeting = ({ params }: { params: { id: string } }) => {
  return (
    <div>My Post: {params.id}</div>
  )
}

export default Meeting