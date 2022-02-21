import styled from 'styled-components'

export const Cell = styled.div`
    grid-row: span 1;
    display: flex;
    flex-direction: column;
    color: #414141;
    max-width: 150px;
`

export const CellHead = styled.label`
    font-weight: 500;
`

export const CellValue = styled.label`
    margin-top: 5px;
`

export const BookCover = styled.img`
    grid-row: span 2;
    height: 140px;

    @media (max-width: 720px) {
        grid-row: span 1;
        grid-column: span 2;
    }

    @media (max-width: 450px) {
        height: 100px;
    }

    @media (max-height: 600px) {
        height: 110px;
    }
`

export const BookInfoGrid = styled.div`
    display: grid;
    grid-template-rows: repeat(2, auto);
    grid-template-columns: repeat(3, auto);
    grid-row-gap: 20px;
    grid-column-gap: 100px;

    @media (max-width: 720px) {
        grid-template-rows: repeat(3, auto);
        grid-template-columns: repeat(2, auto);
        grid-row-gap: 40px;
        grid-column-gap: 50px;
    }

    @media (max-width: 450px) {
        grid-row-gap: 30px;
        grid-column-gap: 25px;
        font-size: 12px;
    }
`