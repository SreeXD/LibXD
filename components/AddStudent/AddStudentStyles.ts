import styled from 'styled-components'

import { SubmitContainer } from '../SignInOrUp/SignInOrUpStyles'
import { AnimateIn } from '../List/ListStyles'

export const Title = styled.h1`
    font-size: 38px;
    font-weight: 500;
    color: #616161;
    margin: 20px 0 32px 35px;

    &:before {
        content: 'Add ';
        color: #7582ed;
    }

    @media (max-width: 450px) {
        margin: 20px 0 38px 28px;
        font-size: 32px;
    }
`

export const CloseSpan = styled.span`
    display: inline-block;
    width: 26px;
    height: 3px;
    background-color: #505050;
    border-radius: 5px;
    transition: transform 300ms;
`

export const CloseButton = styled.button`
    position: absolute;
    height: 30px;
    top: 10px;
    right: 18px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    outline: none;
    border: none;
    background: none;
    cursor: pointer;
    transform: scale(0.80);

    ${CloseSpan}:nth-child(1) {
        transform: translateY(2px) rotate(45deg);
    }
    
    ${CloseSpan}:nth-child(2) {
        transform: translateY(-1px) rotate(-45deg);
    }

    &:hover {
        ${CloseSpan}:nth-child(1) {
            transform: translateY(2px);
        }
        
        ${CloseSpan}:nth-child(2) {
            transform: translateY(-1px);
        }
    }
`

export const AddStudent = styled.div`
    display: inline-block;
    position: relative;
    max-height: calc(100vh - 30px);
    overflow-y: scroll;
    background-color: white;
    padding: 15px;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.26);
    border-radius: 3px;
    z-index: 4;
    animation: ${AnimateIn} 150ms;

    @media (max-width: 600px) {
        transform: scale(0.9);
    }

    ${SubmitContainer} {
        margin-top: 10px;
    }

    &::-webkit-scrollbar {
        width: 5px;
        background-color: rgba(0, 0, 0, 0);
    }
    
    &::-webkit-scrollbar-thumb {
        border-radius: 3px;
        background-color: #dadada;

        &:hover {
            background-color: ${props => props.theme.mode ? props.theme.primary : props.theme.secondary};
        }
    }
`