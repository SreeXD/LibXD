import styled from 'styled-components'

const SignOut = styled.button`
    position: fixed;
    top: 12px;
    right: 20px;
    display: flex;
    align-items: center;
    padding: 15px 20px;
    outline: none; 
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-family: 'Poppins';
    font-weight: 600;
    color: #444;
    background-color: white;
    box-shadow: 0 0 4px 0px rgba(0, 0, 0, 0.12);
    transition: background-color 300ms, padding 300ms, right 300ms;
    z-index: 1;

    &.go-right {
        right: -150px;
    }

    &:hover {
        cursor: pointer;
        background-color: #f6f6f6;
        padding-right: 25px;
        
        img {
            margin-right: 13px;
        }
    }

    img {
        width: 20px;
        height: 20px;
        margin-right: 10px;
        transition: margin 300ms;
    }

    @media (max-width: 700px) {
        right: 0;
        top: 8px;
        transform: scale(0.85);
    }
`

export default SignOut