import React from 'react'

import * as S from './BookInfoStyles'

const BookInfo = (props: any) => {
    const bookInfo = props.bookInfo; 
    
    return (
        <S.BookInfoGrid>
            <S.BookCover src={bookInfo.coverSrc} />
            
            <S.Cell>
                <S.CellHead>Title</S.CellHead>
                <S.CellValue>{bookInfo.title}</S.CellValue>
            </S.Cell>

            <S.Cell>
                <S.CellHead>Authors</S.CellHead>
                <S.CellValue>{bookInfo.authors.join(', ')}</S.CellValue>
            </S.Cell>

            <S.Cell>
                <S.CellHead>Publishers</S.CellHead>
                <S.CellValue>{bookInfo.publisher}</S.CellValue>
            </S.Cell>

            <S.Cell>
                <S.CellHead>Languages</S.CellHead>
                <S.CellValue>{bookInfo.categories.join(', ')}</S.CellValue>
            </S.Cell>
        </S.BookInfoGrid>
    )
}

export default BookInfo