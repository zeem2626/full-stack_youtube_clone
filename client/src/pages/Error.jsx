import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 3.3rem;
  font-weight: 600;
  /* border: 1px solid red; */
  height: 93.4vh;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

`

const Error = () => {
  return (
    <Container>
      <div>404 Not found</div>
    </Container>
  )
}

export default Error