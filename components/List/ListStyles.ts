import styled, { css, keyframes } from 'styled-components'

import { TableContainer } from '../General/Styles'

interface Props {
    primary?: string
    activated?: boolean
    notWindow?: boolean
}

export const Span = styled.span`
    display: inline-block;
`

export const Search = styled.div<Props>`
    cursor: pointer;
    margin: 0 30px;
    transform: scale(0.92);

    ${Span}:nth-child(1) {
        width: 16px;
        height: 16px;
        border: 3px solid #525252;
        border-radius: 100%;
        transition: border-color 300ms;
    }

    ${Span}:nth-child(2) {
        width: 7px;
        height: 2px;
        transform: translate3D(-5px, 0px, 0) rotate(45deg);
        background-color: #525252; 
        border-radius: 3px;
        transition: background-color 300ms;
    }

    &:hover {
        ${Span}:nth-child(1) {
            border-color: ${props => props.theme.primary};
        }

        ${Span}:nth-child(2) {
            background-color: ${props => props.theme.primary};
        }
    }

    ${props => props.activated && css`
        ${Span}:nth-child(1) {
            border-color: ${props => props.theme.primary};
        }

        ${Span}:nth-child(2) {
            background-color: ${props => props.theme.primary};
        }
    `}

    @media (max-width: 700px) {
        transform: scale(0.8);
        margin: 0 20px;
    }

    @media (max-width: 450px) {
        transform: scale(0.7);
        margin: 0 10px;
    }
`

export const SearchBar = styled.input<Props>`
    width: 0;
    border: none;
    outline: none;
    transition: width 300ms, margin 300ms;
    border-bottom: solid 2px ${props => props.theme.primary};

    ${props => props.activated && css`
        width: 15vw;
        margin-right: 20px;
        margin-left: -20px;

        @media (max-width: 700px) {
            margin-left: -15px;
            margin-right: 15px;
            font-size: 13px;
        }

        @media (max-width: 450px) {
            margin-left: -8px;
            margin-right: 4px;
            font-size: 11px;
        }
    `}
`

export const DisplayRange = styled.label`
    font-weight: 400;
    font-size: 13px;
    margin-right: 6px;
    color: #222;

    @media (max-width: 450px) {
        font-size: 10px;
    }
`

export const ControlLeft = styled.div<Props>`
    display: flex;
    flex-direction: column;
    padding: 10px 0;
    margin-left: 20px;
    margin-right: 8px;

    ${Span}:nth-child(1) {
        width: 10px;
        height: 2px;
        background-color: #525252;
        transform-origin: center left;
        transform: rotate(-40deg) translateY(2px);
        transition: background-color 300ms;

    }

    ${Span}:nth-child(2) {
        width: 10px;
        height: 2px;
        background-color: #525252;
        transform-origin: center left;
        transform: rotate(40deg) translateY(-2px);
        transition: background-color 300ms;
    }

    ${props => props.activated && css`
        &:hover {
            cursor: pointer;

            ${Span} {
                background-color: ${props => props.theme.primary};
            }
        }
    `}
    
    @media (max-width: 700px) {
        transform: scale(0.8);
        margin-left: 15px;
    }

    @media (max-width: 450px) {
        transform: scale(0.7);
        margin-left: 8px;
        margin-right: 4px;
    }

    ${props => !props.activated && css`
        opacity: 0.4;
    `}
`

export const ControlRight = styled.div<Props>`
    display: flex;
    flex-direction: column;
    padding: 10px 0;
    margin-left: 4px;
    margin-right: 15px;

    ${Span}:nth-child(1) {
        width: 10px;
        height: 2px;
        background-color: #525252;
        transform-origin: center right;
        transform: rotate(-40deg) translateY(1px);
        transition: background-color 300ms;
    }

    ${Span}:nth-child(2) {
        width: 10px;
        height: 2px;
        background-color: #525252;
        transform-origin: center right;
        transform: rotate(40deg) translateY(-1px);
        transition: background-color 300ms;
    }

    ${props => props.activated && css`
        &:hover {
            cursor: pointer;

            ${Span} {
                background-color: ${props => props.theme.primary};
            }
        }
    `}

    @media (max-width: 700px) {
        transform: scale(0.8);
        margin-right: 12px;
    }

    @media (max-width: 450px) {
        transform: scale(0.7);
        margin-left: 2px;
    }

    ${props => !props.activated && css`
        opacity: 0.4;
    `}
`

export const Close = styled.div<Props>`
    cursor: pointer;
    display: flex;
    flex-direction: column;
    width: 20px;
    margin-left: 10px;
    margin-right: 15px;
    padding: 10px 0;
    transform: translateY(-1px);

    ${Span}:nth-child(1) {
        position: absolute;
        border-radius: 2px;
        width: 18px;
        height: 2px;
        background-color: #525252;
        transform: rotate(-45deg);
        transition: transform 300ms, background-color 300ms;
    }

    ${Span}:nth-child(2) {
        position: absolute;
        border-radius: 2px;
        width: 18px;
        height: 2px;
        background-color: #525252;
        transform: rotate(45deg);
        transition: transform 300ms, background-color 300ms;
    }

    &:hover {
        ${Span}:nth-child(1) {
            transform: rotate(0deg);
        }

        ${Span}:nth-child(2) {
            transform: rotate(0deg) translateY(1px);
        }

        ${Span} {
            background-color: ${props => props.theme.primary};
        }
    }

    @media (max-width: 700px) {
        transform: scale(0.8);
        margin-left: 8px;
        margin-right: 12px;
    }

    @media (max-width: 450px) {
        transform: scale(0.7);
        margin-left: 6px;
        margin-right: 8px;
    }
`

export const ListTitle = styled.h1`
    font-weight: 500;
    font-size: 25px;
    color: #414141;

    @media (max-width: 700px) {
        font-size: 22px;
    }

    @media (max-width: 450px) {
        font-size: 16px;
    }
`

export const ListSubtitle = styled.label`
    color: #555;
    font-weight: 300;
    font-size: 16px;

    @media (max-width: 700px) {
        font-size: 14px;
    }

    @media (max-width: 450px) {
        font-size: 12px;
    }
`

export const HeaderLeft = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 20px;
    margin-top: -2px;

    @media (max-width: 450px) {
        margin-left: 14px;
        margin-top: -0.5px;
    }
`

export const ListControls = styled.div`
    display: flex;
    margin-left: auto;
    justify-content: center;
    align-items: center;
`

export const ListHeader = styled.div`
    display: flex;
    padding: 15px 0;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.26);

    @media (max-width: 450px) {
        padding: 12px 0;
    }
`

export const ControlAdd = styled.div<Props>`
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
    transform: scale(1.2);
    width: 36px;
    height: 36px;
    border-radius: 100%;
    transition: background-color 300ms;

    &:hover {
        background-color: #ededed;
    }

    ${Span}:nth-child(1) {
        position: absolute;
        width: 15px;
        height: 2.5px;
        background-color: #525252;
        transition: background-color 300ms;
        border-radius: 5px;
    }

    ${Span}:nth-child(2) {
        position: absolute;
        width: 15px;
        height: 2.5px;
        background-color: #525252;
        transform: rotate(90deg);
        transition: background-color 300ms;
        border-radius: 5px;
    }

    &:hover {
        ${Span} {
            background-color: ${props => props.theme.primary};
        }
    }

    @media (max-width: 700px) {
        transform: scale(0.9);
        margin-right: 12px;
    }

    @media (max-width: 450px) {
        transform: scale(0.8);
        margin-right: 0;
    }
`

export const ControlRemove = styled.div<Props>`
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
    transform: scale(1.4);
    width: 34px;
    height: 34px;
    border-radius: 100%;
    transition: background-color 300ms;
    margin: 0 5px;

    &:hover {
        background-color: #ededed;
    }

    ${Span}:nth-child(1) {
        position: absolute;
        width: 14px;
        height: 2.5px;
        background-color: #525252;
        transition: background-color 300ms;
        border-radius: 5px;
    }

    &:hover {
        ${Span} {
            background-color: ${props => props.theme.secondary};
        }
    }

    @media (max-width: 700px) {
        transform: scale(0.9);
    }

    @media (max-width: 450px) {
        transform: scale(0.8);
    }
`

export const FooterControls = styled.div`
    display: flex;
    margin-left: auto;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
`

export const ListFooter = styled.div`
    display: flex;
    padding: 5px 0;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.26);

    @media (max-width: 700px) {
        padding: 0;
    }
`

export const AnimateIn = keyframes`
    0% {
        transform: scale(0.9);
        opacity: 0;
    }
`

export const List = styled.div<Props>`
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 3px;
    margin: 10px;
    overflow: hidden;
    animation: ${AnimateIn} 150ms;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.36);
    width: 100%;
    height: 400px;

    ${props => props.notWindow && css`
        ${TableContainer} table {
            min-width: 700px;

            @media (max-width: 800px) {
                min-width: 110vw;
            }
        }
    `}

    ${props => !props.notWindow && css`
        height: calc(100vh - 20px);

        @media (max-width: 450px) {
            margin: 4px;
            height: calc(100vh - 8px);
        }
    `}
`