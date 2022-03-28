import styled from 'styled-components'
export const StyledCanvas = styled.canvas`
  cursor : "e-resize";
`
export const Tooltip = styled.div`
    background : blue;
    position : absolute;
    top: ${props => props.top + "px"};
    left: ${props => props.left + "px"};
    color: white;
    display : ${props => props.display};
    pointer-events: none;
`