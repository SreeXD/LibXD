import styled from 'styled-components'

export const IdkWhatToNameThis = styled.div`
    position: absolute;
    width: 14px;
    height: 14px;
    transform: rotate(45deg);
    background-color: white;
    margin-left: 20px;
    margin-top: 13px;
    box-shadow: 0 0 3px 0px rgba(0, 0, 0, 0.1);
    opacity: 0;
`

export const HelpListItem = styled.li`
    margin: 8px 0;
    font-size: 15px;
    color: #414141;
`

export const HelpList = styled.ol`

`

export const HelpWindow = styled.div`
    margin-top: 20px;
    border-radius: 4px;
    background-color: white;
    box-shadow: 0 0 3px 0px rgba(0, 0, 0, 0.1);
    padding: 20px 30px;
    opacity: 0;
`

export const QuestionMark = styled.h1`
    color: #515151;
    font-weight: 500;
    font-size: 26px;
    text-align: center;
    cursor: default;
`

export const HelpButton = styled.div`
    width: 48px;
    height: 48px;
    background-color: white;
    border-radius: 100%;
    box-shadow: 0 0 3px 0px rgba(0, 0, 0, 0.2);
    transition: width 200ms, height 200ms, padding 200ms;
    padding-top: 6px;

    &:hover {
        width: 52px;
        height: 52px;
        padding: 8px;
        cursor: pointer;
    }

    @media (max-width: 600px) {
        left: 7px;
    }
`

export const Help = styled.div`
    position: fixed;
    left: 10px;
    top: 10px;

    @media (max-width: 600px) {
        transform-origin: left top;
        transform: scale(0.8);
    }

    &.show {
        ${HelpWindow} {
            opacity: 1;
        }

        ${IdkWhatToNameThis} {
            opacity: 1;
        }
    }
`