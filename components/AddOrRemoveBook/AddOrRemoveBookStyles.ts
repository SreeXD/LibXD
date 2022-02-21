import styled, { css, keyframes } from 'styled-components'

import type { Props } from '../SignInOrUp/SignInOrUpStyles'
import { AnimateIn } from '../List/ListStyles'

const animateTitleIn = keyframes`
    0% {
        opacity: 0;
        transform: translateY(20px);
    }

    100% {
        opacity: 1;
        transform: none;
    }
`

export const Title = styled.h1<Props>`
    position: relative;
    font-weight: 500;
    font-size: 39px;
    color: #414141;
    margin-top: 5px;
    margin-bottom: 10px;
    margin-left: 32px;
    padding-top: calc(15px + 0.2vw);
    padding-bottom: 10px;
    padding-left: calc(${props => !props.theme.mode ? '75px' : '0px + 1vw'});
    transition: padding-left 250ms;

    &:before {
        display: inline-block;
        content: 'Add';
        color: #7F5FFD;

        ${props => !props.theme.mode && css`
            transform: translateY(-20px);
            opacity: 0;
            transition: 200ms 200ms;
        `}

        ${props => props.theme.mode && css`
            content: 'Add ';
            opacity: 0;
            animation: ${animateTitleIn} 200ms 200ms forwards;
        `}
    }

    &:after {
        display: inline-block;
        position: absolute;
        left: 0px;
        content: 'Remove ';
        color: #FA7979;
        margin-left: 8px;

        ${props => props.theme.mode && css`
            transform: translateY(-20px);
            opacity: 0;
            transition: 200ms 200ms;
        `}

        ${props => !props.theme.mode && css`
            opacity: 0;
            opacity: 0;
            animation: ${animateTitleIn} 200ms 200ms forwards;
        `}
    }

    @media (max-width: 450px) {
        font-size: 30px;
        margin-bottom: 0px;
        padding-left: calc(${props => !props.theme.mode ? '60px' : '0px + 1vw'});
    }
`

export const InfoGrid = styled.div<Props>`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-column-gap: 60px;
    grid-row-gap: 50px;
    margin: 25px;
    margin-top: 46px;

    @media (max-width: 720px) {
        margin-top: 40px;
        margin-left: 30px;
        grid-column-gap: 80px;
        grid-row-gap: 38px;
    }
`

export const InfoCell = styled.div`

`

export const CellTitle = styled.label`
    color: #525252;
    font-size: 14px;
    font-weight: 500;
`

export const CellValue = styled.p`
    color: ${ props => props.theme.mode ? '#7F5FFD' : '#FA7979' };
    font-size: 14px;
    font-weight: 500;
    width: calc(100% + 20px);
`

export const FormPart = styled.div`
    margin: 15px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`

export const BookCover = styled.img`
    width: 240px;
    margin: 20px;
    border-radius: 7px;
    object-fit: contain;

    @media (max-width: 720px) {
        height: 110px;
        width: auto;
        border: none;
        margin: 3px;
        padding: 3px;
    }
`

export const Inputs = styled.div`
    width: 100%;
    
    @media (max-width: 720px) {
        display: flex;
    }

    @media (max-width: 380px) {
        flex-direction: column;
    }
`

export const Form = styled.div`
    display: flex;

    @media (max-width: 720px) {
        flex-direction: column;
        padding-right: 30px;
    }
`

export const SubmitDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
    margin-top: 25px;
    margin-left: 15px;
    
    button {
        margin: 0 70px;
    }
    
    @media (max-width: 720px) {
        padding: 0px;

        button {
            margin: 0 30px;
        }
    }

    @media (max-width: 450px) {
        button {
            margin: 0 12px;
        }
    }
`

export const Toggle = styled.label<Props>`
    margin: 0 70px;
    color: ${props => !props.theme.mode ? '#7F5FFD' : '#FA7979'};
    transition: color 300ms;
    cursor: pointer;

    @media (max-width: 720px) {
        margin: 0 10px;
    }

    @media (max-width: 450px) {
        font-size: 15px;
    }
`

export const StatusMessage = styled.h5`
    font-weight: 500;
    text-align: center;
    margin-top: 18px;
    color: ${props => props.color};
    width: 100%;
    padding: 0 30px;
    transform: translateY(-2px);
`

export const CloseSpan = styled.span<Props>`
    display: inline-block;
    width: 30px;
    height: 4px;
    background-color: ${props => props.theme.mode ? '#7F5FFD' : '#FA7979'};
    border-radius: 5px;
    transition: transform 300ms, background-color 300ms;

    &:nth-child(1) {
        transform: translateY(2px) rotate(45deg);
    }
    
    &:nth-child(2) {
        transform: translateY(-2px) rotate(-45deg);
    }
`

export const CloseButton = styled.button`
    border: none;
    outline: none;
    background: none;
    position: absolute;
    right: 18px;
    top: 25px;
    display: flex;
    flex-direction: column;
    padding: 12px;
    cursor: pointer;
    z-index: 2;
    transform: scale(0.8);

    @media (max-width: 720px) {
        top: 12px;
        right: 2px;
    }

    &:hover {
        ${CloseSpan}:nth-child(1) {
            transform: translateY(2px) rotate(-0deg);
        }

        ${CloseSpan}:nth-child(2) {
            transform: translateY(-2px) rotate(0deg);
        }
    }
`

export const LoadingContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    padding-top: 20px;
    padding-bottom: 5px;
`

export const AddOrRemoveBook = styled.div<Props>`
    position: relative;
    max-height: calc(100vh - 30px);
    overflow-y: scroll;
    width: 700px;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.26);
    border-radius: 3px;
    padding-bottom: 14px;
    background-color: white;
    z-index: 4;
    animation: ${AnimateIn} 150ms;

    @media (max-width: 450px) {
        transform: scale(0.9);
    }

    &::-webkit-scrollbar {
        width: 5px;
        height: 4px;
        background-color: rgba(0, 0, 0, 0);
    }
    
    &::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background-color: #d5d5d5;

        &:hover {
            background-color: ${props => props.theme.mode ? props.theme.primary : props.theme.secondary};
        }
    }

    @media (max-width: 720px) {
        width: calc(300px + 20vw);

        &::-webkit-scrollbar {
            width: 5px;
        }
    }
`