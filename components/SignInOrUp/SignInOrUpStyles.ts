import styled, { css, keyframes } from 'styled-components'

export interface Props {
    mode?: number
    textLength?: number
    error?: boolean
    theme?: any
    half?: boolean
}

const color = (props: Props) => {
    if (props.error) return '#fd9595'

    return (props.theme.mode ? props.theme.primary : props.theme.secondary)
}

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
    display: inline-block;
    position: relative;
    font-weight: 500;
    font-size: calc(28px + 1vw);
    color: #414141;
    padding: calc(20px + 0.2vw) 0;
    padding-left: calc(30px + 1vw);
    margin-top: 5px;
    margin-bottom: 5px;

    &:after {
        display: inline-block;
        margin-left: 10px;
        content: ' in';
        color: #2A98FE;

        ${props => props.theme.mode && css`
            transform: translateY(-20px);
            opacity: 0;
            transition: 150ms;
        `}

        ${props => !props.theme.mode && css`
            content: ' in';
            animation: ${animateTitleIn} 150ms;
        `}
    }

    &:before {
        display: inline-block;
        position: absolute;
        right: -13px;
        content: ' up';
        color: #B061FF;

        ${props => !props.theme.mode && css`
            transform: translateY(-20px);
            opacity: 0;
            transition: 150ms;
        `}

        ${props => props.theme.mode && css`
            animation: ${animateTitleIn} 150ms;
        `}
    }
`

export const Label = styled.label<Props>`
    display: inline-block;
    color: #525252;
    font-weight: 500;
    font-size: calc(13px + 0.1vw);
    background-color: white;
    transform: translate3D(20px, 9px, 0);
    transition: margin-left 200ms;
    padding: 0 10px;
    
    &.focus {
        margin-left: calc(50% - ${props => props.textLength} * (14px + 0.1vw) - 10px);
    }
`

export const TextBox = styled.input<Props>`
    width: 100%;
    height: calc(34px + 0.7vw);
    border: 3px solid ${props => color(props)};
    border-radius: 7px;
    outline: none;
    color: #414141;
    font-size: 13px;
    padding: 15px;
    transition: border-color 300ms;

    &:focus {
        border-color: #686868;
    }
`
    
export const TextInputInner = styled.div<Props>`
    width: 100%;
    align-self: center;
    
    ${props => props.half && css`
        display: flex;
        flex-direction: column;

        &:nth-child(1) {
            margin-right: 10px;
        }

        &:nth-child(2) {
            margin-left: 10px;
        }
    `}
`;

export const ErrorMessage = styled.label`
    align-self: center;
    color: #F66D6D;
    font-weight: 500;
    font-size: calc(9px + 0.25vw);
    margin-top: 4px;
`

export const TextInput = styled.div<Props>`
    display: flex;
    flex-direction: ${props => props.half ? 'row' : 'column'};
    justify-content: center;
    margin-bottom: 15px;
    padding: 0 20px;
`

export const SignUpInputs = styled.div`
    max-height: 5px;
    overflow: hidden;
    transition: max-height 400ms;

    ${props => props.theme.mode && css`
        max-height: 220px;
    `}
`

export const SubmitSpan = styled.span`
    display: inline-block;
    width: 16px;
    height: 3px;
    background-color: #5A5A5A;
    transform-origin: right;
    transition: transform 400ms, background-color 400ms;
`

export const Submit = styled.button`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    outline: none;
    background: none;
    border-radius: 100%;
    width: 70px;
    height: 70px;
    border: solid 3px #5A5A5A;
    margin-top: 20px;
    transition: transform 300ms 400ms, border-color 300ms;
    cursor: pointer;

    ${SubmitSpan}:nth-child(1) {
        transform: translateY(3px) rotate(40deg);
    }
    
    ${SubmitSpan}:nth-child(2) {
        transform: translateY(-1px) rotate(-40deg);
    }

    &:disabled {
        border: solid 2px #fd9595;
        transition: transform 300ms, border-color 300ms;

        ${SubmitSpan} {
            background-color: #fd9595;
            width: calc(22px + 0.4vw);
            border-radius: 5px;
            height: 2px;
        }

        ${SubmitSpan}:nth-child(1) {
            transform: translateY(3px);
        }
        
        ${SubmitSpan}:nth-child(2) {
            transform: translateY(0px);
        }
    }

    &:not(:disabled) {
        &:hover {
            transform: scale(1.2);
            border-color: rgb(0, 0, 0, 0);
            transition: transform 300ms, border-color 300ms;

            ${SubmitSpan} {
                transition: transform 400ms 300ms, background-color 400ms 300ms;
                background-color:  ${props => !props.theme.mode ? props.theme.secondary : props.theme.primary };
            }

            ${SubmitSpan}:nth-child(1) {
                transform: translateX(5px) translateY(3px) rotate(40deg);
            }
            
            ${SubmitSpan}:nth-child(2) {
                transform: translateX(5px) translateY(-1px) rotate(-40deg);
            }
        }
    }

    @media (max-width: 450px) {
        transform: scale(0.9);
    }
`

export const Form = styled.div`
    padding: 0 calc(15px + 0.8vw);
`

export const SubmitContainer = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 25px 50px;
    margin-bottom: 15px;
`

export const Toggle = styled.h1`
    align-self: center;
    margin-top: 40px;
    margin-bottom: 20px;
    font-size: calc(12px + 0.2vw);
    font-weight: 500;
    color: ${props => !props.theme.mode ? '#6AB7FF' : '#B061FF'};
    cursor: pointer;
    transition: color 500ms;

    &:hover {
        color: ${props => props.theme.mode ? '#6AB7FF' : '#B061FF'};
    }
`

export const SignInOrUp = styled.div<Props>`
    width: 400px;
    max-height: calc(100vh - 20px);
    overflow-y: scroll;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.30);
    border-radius: 3px;
    padding-top: 10px;
    padding-bottom: 30px;
    background-color: white;

    &::-webkit-scrollbar {
        width: 6px;
        height: 5px;
        background-color: rgba(0, 0, 0, 0);
        margin-right: 20px;
    }
    
    &::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background-color: #d5d5d5;

        &:hover {
            background-color: ${props => props.theme.mode ? props.theme.primary : props.theme.secondary};
        }
    }

    @media (max-width: 720px) {
        &::-webkit-scrollbar {
            width: 5px;
        }
    }

    @media (max-width: 400px) {
        width: 100%;
    }
`