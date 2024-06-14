import React, { useState } from 'react'
import Heart from '@react-sandbox/heart'

function App() {
  const [active, setActive] = useState(false)

  return (
    <div>
      <Heart
        width={24}
        height={24}
        active={active}
        onClick={() => setActive(!active)}
      />
    </div>
  )
}