import styled from 'styled-components'

export const LoadingContainer = styled.div`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

export const CloseSpan = styled.span`
    display: inline-block;
    width: 30px;
    height: 4px;
    background-color: #2f2f2f;
    border-radius: 5px;
    transition: transform 300ms;

    &:nth-child(1) {
        transform: translateY(2px) rotate(45deg);
    }
    
    &:nth-child(2) {
        transform: translateY(-2px) rotate(-45deg);
    }
`

export const AddStudentContainer = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    min-height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
`

export const StudentInfoContainer = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
    background: none;
    z-index: 4;
`