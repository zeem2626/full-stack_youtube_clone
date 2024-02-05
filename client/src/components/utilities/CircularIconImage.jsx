import React from 'react'
import styled from "styled-components";

const Container = styled.div`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
  overflow: hidden;
  `

const Img = styled.img`
  width: 100%;
  height: 100%;
`
const Image = ({src, size}) => {
  return (
    <Container size={`${size}rem`}>
      <Img src={src} />
    </Container>
  )
}

export default Image
