import styled from 'styled-components'
export const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  width: fit-content;
  height: fit-content;
  flex-direction: column;
  overflow: scroll;
`

export const Tooltip = styled.div.attrs(props => ({
  style: {
    top: props.top + "px",
    left: props.left + "px",
    display : props.display
  },
  }))`
    background : blue;
    position : absolute;
    color: white;
    pointer-events: none;
`
export const AddObjectButton = styled.div`
    width: 25px;
    height: 50%;
    padding: 5px;
    border-radius: 5px;
    margin-left: 5%;
    cursor: pointer;
`
export const UtilsWrapper = styled.div`
    display: flex;
    width: 100%;
    height: 50px;
    justify-content: start;
    align-items: center;
`