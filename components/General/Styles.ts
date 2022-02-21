import styled, { css } from 'styled-components'

export const LoadingContainer = styled.div`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 5;
`

export const Bg = styled.div`
    position: fixed;
    border-radius: 8px;
    height: calc(100vh - 20px);
    width: calc(100vw - 20px);
    background-color: rgba(240, 240, 240, 0.5);
    z-index: 3;
`

const cell = css`
    padding: 13px 10px;
    padding-left: 20px;
    color: #303030;
    font-size: 14px;

    @media (max-width: 720px) {
        font-size: 13px;
    }

    @media (max-width: 450px) {
        font-size: 12px;
        padding: 10px;
        padding-left: 14px;
    }

    @media (max-width: 375px) {
        font-size: 11px;
    }
`

export const TableHeader = styled.th`
    ${cell}
    text-align: left;
    font-weight: 500;
`

export const TableData = styled.td`
    ${cell}
    overflow: hidden;
`

export const TableRow = styled.tr`
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.24);

    &.overdue {
        background-color: #fff0f0;
    }

    &:nth-child(1) {
        ${TableHeader}, ${TableData} {
            font-weight: 500;
            color: #515151;
        } 
    }

    &:not(&:nth-child(1)) {
        &:hover {
            cursor: pointer;
            background-color: #f4f4f4;
        
            &.overdue {
                background-color: #fcebeb;
            }
        }
    }
`

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    border-radius: 5px;
    overflow: hidden;
`

export const TableContainer = styled.div`
    overflow: scroll;
    height: 100%;

    &::-webkit-scrollbar {
        width: 6px;
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

    @media (max-width: 450px) {
        &::-webkit-scrollbar {
            width: 5px;
            height: 4px;
            background-color: rgba(0, 0, 0, 0);
        }
    }
`