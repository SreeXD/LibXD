import React from 'react'

import * as S from './AlertStyles'

export const Alert = (props: any) => {

    return (
        <S.Alert>
            <S.WarningIcon src='/resources/warning.png' />

            <S.AlertText>
                {"Student admno {props.admNo} hasn't returned any of the following books that are overdue"}
            </S.AlertText>

            <S.BooksList>
                {(props.overdue as any[]).map((b, i) => (
                    <S.BooksListItem key={i}>{b.isbn}</S.BooksListItem>
                ))}
            </S.BooksList>

            <S.Choice>
                <S.Cancel onClick={props.cancel}>Cancel</S.Cancel>
                <S.Proceed onClick={props.proceed}>Proceed anyway</S.Proceed>
            </S.Choice>
        </S.Alert>
    )
}

export default Alert