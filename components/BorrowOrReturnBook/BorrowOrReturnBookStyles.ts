import styled, { css } from 'styled-components'

import { SubmitContainer } from '../SignInOrUp/SignInOrUpStyles'
import { StatusMessage } from '../AddOrRemoveBook/AddOrRemoveBookStyles'
import { AnimateIn } from '../List/ListStyles'

export const Title = styled.h1`
    font-size: calc(25px + 0.5vw);
    font-weight: 500;
    color: #616161;
    margin: 20px 0;
    text-align: center;

    @media (max-width: 450px) {
        font-size: calc(28px + 0.5vw);
    }
`

export const BorrowOrReturnButtons = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`

const BorrowOrReturnButton = css`
    outline: none;
    border: none;
    padding: calc(12px + 0.3vw) calc(20px + 0.8vw);
    border-radius: 10px;
    font-size: calc(12px + 0.1vw);
    margin: 12px 8px;
`

export const BorrowButton = styled.button`
    ${BorrowOrReturnButton}
    color: #83C37E;
    background-color: #E9FFE2;
    transition: background-color 300ms, color 300ms;

    &:hover {
        cursor: pointer;
        background-color: #dffad7;
    }

    &.activated {
        color: white;
        background-color: #7ef492;   
    }
`

export const ReturnButton = styled.button`
    ${BorrowOrReturnButton}
    color: #D98B8B;
    background-color: #FEF0F0;
    transition: background-color 300ms, color 300ms;

    &:hover {
        cursor: pointer;
        background-color: #fae6e6;
    }

    &.activated {
        color: white;
        background-color: #ff9696;   
    }
`

export const Label = styled.label`
    display: inline-block;
    color: #6F6F6F;
    font-weight: 500;
    font-size: 13px;
    background-color: white;
    transform: translate3D(20px, 8px, 0);
    transition: margin-left 200ms;
    padding: 0 10px;
    z-index: 10;
`

export const TextBox = styled.input`
    width: 100%;
    border: none;
    outline: none;
    color: #6F6F6F;
    font-size: 13px;
    padding-top: 16px;
    padding-bottom: 8px;
`

export const Inputs = styled.div`
    display: flex;
    margin-top: 15px;

    @media (max-width: 550px) {
        flex-direction: column;
    }
`

export const InputSearchHead = styled.label`
    color: #6F6F6F;
    font-weight: 500;
    font-size: 12px;
`

export const InputSearchValue = styled.label`
    color: ${props => props.theme.fontColor};
    font-weight: 500;
    font-size: 12px;
`

export const InputSearchEntry = styled.div`
    font-weight: 500;
    display: flex;
    flex-direction: column;
    padding: 5px 6px;

    &:hover {
        cursor: pointer;
        background-color: #f5f5f5;
    }
`

export const InputSearch = styled.div`
    max-height: 0px;
    overflow-y: scroll;
    z-index: 5;

    &::-webkit-scrollbar {
        width: 6px;
        background-color: rgba(0, 0, 0, 0);
    }
    
    &::-webkit-scrollbar-thumb {
        background-color: #d5d5d5;

        &:hover {
            background-color: #b8b8b8;
        }
    }

    @media (max-width: 720px) {
        &::-webkit-scrollbar {
            width: 5px;
        }
    }
`

export const TextBoxWithSearch = styled.div<any>`
    width: 100%;
    border: 2px solid ${props => props.error ? '#fd9595' : props.theme.color };
    border-radius: 5px;
    transition: border-color 300ms;
    padding: 0 10px;

    &.focus {
        border-color: #9F9F9F;

        ${InputSearch} {
            max-height: 200px;
            margin: 8px 0;
            transition: max-height 200ms;
        }

        ${TextBox} {
            border-bottom: 1px solid #c8c8c8;
        }
    }
`
    
export const TextInputInner = styled.div`
    width: 100%;
    align-self: center;
`;

export const ErrorMessage = styled.label`
    align-self: center;
    color: #F66D6D;
    font-weight: 500;
    font-size: calc(9px + 0.25vw);
    margin-top: 4px;
`

export const TextInput = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 15px 0;
    padding: 0 20px;
`

export const GridCellValue = styled.label`

`

export const GridCellHead = styled.label`
    color: #6F6F6F;
    font-weight: 500;
`

export const GridCell = styled.div`
    display: flex;
    flex-direction: column;
    color: ${props => props.theme.fontColor};
`

export const Grid = styled.div`
    display: grid;
    margin-top: 15px;
    margin-bottom: 40px;
    margin-left: 5px;
    grid-template-rows: repeat(2, auto);
    grid-template-columns: repeat(2, auto);
    grid-column-gap: 34px;
    grid-row-gap: 60px;
    width: calc(100% - 60px);
    font-size: 13px;
`

export const InputContainer = styled.div`
    width: 100%;
    border: solid 2px ${props => props.theme.color};
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px;

    @media (max-width: 550px) {
        margin: 0;
        margin-top: 10px;
        margin-bottom: 20px;
    }
`

export const BorrowDuration = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    max-height: 0;
    overflow: hidden;
    transition: max-height 200ms;

    &.show {
        max-height: 40px;
        margin-bottom: 12px;
    }
`

export const DurationLabel = styled.label`
    color: #616161;
    font-weight: 500;
    font-size: 14px;
    margin: 5px 10px;
`

export const DurationOption = styled.option`
    color: #616161;
    font-weight: 500;
    font-size: 14px;
`

export const DurationSelect = styled.select`
    width: calc(100% - 40px);
    padding: 10px 0;
    padding-left: 8px;
    outline: none;
    color: #616161;
    border: 2px solid ${props => props.theme.color};
    border-radius: 5px;
`

export const AlertContainer = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    z-index: 5;
    background-color: rgba(240, 240, 240, 0.4);
`

export const BorrowOrReturnBook = styled.div`
    display: inline-block;
    position: relative;
    width: 700px;
    max-height: calc(100vh - 30px);
    overflow-y: scroll;
    background-color: white;
    padding: 20px;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.26);
    border-radius: 3px;
    z-index: 4;
    animation: ${AnimateIn} 150ms;

    @media (max-width: 750px) {
        transform: scale(0.95);
    }

    ${SubmitContainer} {
        margin: -10px;
        margin-bottom: 12px;
    }

    ${StatusMessage} {
        margin-bottom: 12px;
    }

    &::-webkit-scrollbar {
        width: 5px;
        background-color: rgba(0, 0, 0, 0);
    }
    
    &::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background-color: #d5d5d5;

        &:hover {
            background-color: #b8b8b8;
        }
    }
`