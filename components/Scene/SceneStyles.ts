import styled from 'styled-components'

export const UIContainer = styled.div`
    position: absolute;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 0;
`

export const CanvasContainer = styled.div`
    height: 100vh;
    overflow: hidden;
`

export const Canvas = styled.canvas`
    max-width: 100vw;
`