import styled from 'styled-components'

import { AnimateIn } from '../List/ListStyles'
import { CloseButton } from '../AddStudent/AddStudentStyles'

export const StudentGridCellValue = styled.label`

`

export const StudentGridCellHead = styled.label`
    color: #414141;
    font-weight: 500;
`

export const StudentGridCell = styled.div`
    display: flex;
    flex-direction: column;
`

export const StudentGrid = styled.div`
    display: grid;
    grid-template-rows: repeat(2, auto);
    grid-template-columns: repeat(2, auto);
    grid-column-gap: 50px;
    grid-row-gap: 30px;
    width: 60%;
    margin-top: 50px;
    min-width: 200px;
    font-size: 15px;

    @media (max-width: 650px) {
        font-size: 14px;
        grid-row-gap: 25px;
        margin-top: 60px;
    }

    @media (max-width: 600px) {
        width: 100%;
        margin-left: 10px;
        margin-top: 40px;
        grid-column-gap: 60px;
    }
`

export const StudentSubtitle = styled.h2`
    color: #414141;
    font-weight: 500;
    font-size: 90px;

    @media (max-width: 650px) {
        margin-top: 10px;
        font-size: 70px;
    }

    @media (max-width: 600px) {
        margin-top: 0;
        font-size: 24px;
        margin-left: 10px;
    }
`

export const StudentTitle = styled.h1`
    color: #414141;
    font-weight: 500;
    font-size: 32px;

    @media (max-width: 650px) {
        font-size: 24px;
    }

    @media (max-width: 600px) {
        margin-left: 10px;
    }
`

export const StudentInfoHead = styled.div`
    width: 40%;
    margin-right: 110px;

    @media (max-width: 600px) {
        margin: 0;
        display: flex;
    }
`

export const StudentInfoUpper = styled.div`
    display: flex;
    width: 100%;

    @media (max-width: 600px) {
        flex-direction: column;
    }
`

export const BorrowLoading = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 5;
    margin-top: 50px;
`

export const StudentInfo = styled.div`
    position: relative;
    padding: 25px;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.26);
    background-color: white;
    max-width: calc(100vw - 20px);
    max-height: calc(100vh - 30px);
    border-radius: 7px;
    overflow: scroll;
    z-index: 5;
    animation: ${AnimateIn} 150ms;

    @media (max-width: 450px) {
        padding: 15px;

        ${CloseButton} {
            transform: scale(0.65);
        }
    }

    &::-webkit-scrollbar {
        width: 5px;
        height: 5px;
        background-color: rgba(0, 0, 0, 0);
    }
    
    &::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background-color: #cecece;

        &:hover {
            background-color: #b2b2b2;
        }
    }

    @media (max-width: 600px) {
        min-width: auto;
    }
`