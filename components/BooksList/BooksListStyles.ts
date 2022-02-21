import styled from 'styled-components'

export const BookInfo = styled.div`
    position: fixed;
    display: inline-block;
    visibility: hidden;
    padding: 20px;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.45);
    border-radius: 3px;
    background-color: white;
    z-index: 3;

    @media (max-height: 600px) {
        transform: scale(0.75);
    }

    @media (max-height: 400px) {
        transform: scale(0.65);
    }
`

export const AddOrRemoveBookContainer = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    min-height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 6;
`