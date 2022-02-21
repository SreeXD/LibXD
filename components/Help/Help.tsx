import React, { useState } from 'react'

import * as S from './HelpStyles'

const Help = () => {
    const [ show, setShow ] = useState<boolean>(false)

    return (
        <S.Help className={(show ? 'show' : '')}>
            <S.HelpButton onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
                <S.QuestionMark>?</S.QuestionMark>
            </S.HelpButton>

            <S.IdkWhatToNameThis />

            <S.HelpWindow>
                <S.HelpList>
                    <S.HelpListItem>click on book shelf to add / remove books to library</S.HelpListItem>
                    <S.HelpListItem>click on work desk to add student information</S.HelpListItem>
                    <S.HelpListItem>click on calendar to lend / retrieve books</S.HelpListItem>
                </S.HelpList>
            </S.HelpWindow>
        </S.Help>
    )
}

export default Help