import styled from 'styled-components'

export const LoadingText = styled.h4`
    margin: 36px;
    color: #515151;
    font-weight: 500;
    font-size: 15px;

    @media (max-width: 700px) {
        font-size: 14px;
    }
`

export const SceneLoadingInner = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

export const SceneLoading = styled.div`
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
`