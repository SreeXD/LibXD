import styled, { css, keyframes } from 'styled-components'

export const WarningIcon = styled.img`
    margin-top: 60px;
    margin-bottom: 35px;
    transform: scale(1.2);

    @media (max-width: 600px) {
        transform: scale(1);
    }

    @media (max-height: 500px) {
        margin-top: 40px;
        margin-bottom: 20px;
    }
`

export const AlertText = styled.p`
    color: white;
    font-size: 16px;
    font-weight: 500;
    margin: 30px;
    text-align: center;

    @media (max-width: 450px) {
        font-size: 14px;
        margin: 20px;
    }
`

export const BooksListItem = styled.li`
    color: white;
    font-size: 16px;
    font-weight: 500;
    list-style: none;

    @media (max-width: 450px) {
        font-size: 14px;
    }
`

export const BooksList = styled.ul`

`

const choice = css`
    color: white;
    font-size: 16px;
    font-weight: 500;
    text-decoration: underline;
    margin: 20px;
    margin-top: 50px;
    
    &:hover {
        cursor: pointer;
    }

    @media (max-width: 450px) {
        font-size: 14px;
        margin-top: 60px;
    }
`

export const Cancel = styled.label`
    ${choice}
`

export const Proceed = styled.label`
    ${choice}
`

export const Choice = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 40px;
`

const animateAlert = keyframes`
    0% {
        height: 0;
    }

    99% {
        overflow-y: hidden;
    }

    100% {
        height: 80vh;
        overflow-y: scroll;
    }
`

export const Alert = styled.div`
    width: 450px;
    max-height: 80vh;
    animation: ${animateAlert} 300ms forwards;
    background-color: #fc5151;
    border-radius: 6px;
    box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: hidden;

    @media (max-width: 500px) {
        width: 85%;
    }

    &::-webkit-scrollbar {
        width: 6px;
        background-color: #fc5151;
    }
    
    &::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background-color: white;

        &:hover {
            background-color: #efefef;
        }
    }

    @media (max-width: 720px) {
        &::-webkit-scrollbar {
            width: 5px;
        }
    }
`