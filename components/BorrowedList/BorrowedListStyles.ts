import styled from 'styled-components'

export const Title = styled.h1`
    display: inline-block;
    font-weight: 500;
    font-size: 36px;
    color: #414141;
    margin: -10px 15px 15px 8px;

    @media (max-width: 720px) {
        font-size: 36px;
        margin: 15px 0px 15px 8px;
    }

    @media (max-width: 450px) {
        font-size: 25px;
    }

    @media (max-width: 350px) {
        font-size: 22px;
    }
`

export const BorrowOrReturnBookContainer = styled.div`
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

export const TableDataUpper = styled.label`
    cursor: pointer;
`

export const TableDataUnder = styled.label`
    color: #666;
    cursor: pointer;
`

export const TableDataInner = styled.div`
    display: flex;
    flex-direction: column;
    cursor: pointer;
`