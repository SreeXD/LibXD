import React, { useEffect, useState, useRef } from 'react'
import PropagateLoader from 'react-spinners/PropagateLoader'
import { ThemeProvider } from 'styled-components'

import * as booksApi from '../../api/books'
import { TextInput, TextInputInner, TextBox, ErrorMessage, Label, Submit, SubmitSpan } from '../SignInOrUp/SignInOrUpStyles'
import * as S from './AddOrRemoveBookStyles'

const AddOrRemoveBook = (props: any) => {
    let [mode, setMode] = useState<any>(props.initialMode ?? 1)
    const [mobile, setMobile] = useState<boolean>(false)
    const [book, setBook] = useState<any>({ isbn: '', nCount: 0 })
    const [bookInfo, setBookInfo] = useState<any>({ title: '',  authors: '', categories: '', publisher: '', nCount: 0, coverSrc: '' })
    const [errorMessages, setErrorMessages] = useState<any>({ isbn: '', nCount: '' })
    const [statusMessage, setStatusMessage] = useState<any>({ msg: '', color: '#000' })
    const [submitting, setSubmitting] = useState<boolean>(false)
    const errorsRef = useRef(errorMessages)

    const disabled = () => {
        return Object.keys(errorMessages).some(x => errorMessages[x] != '')
    }

    const onKeyDown = (e: any) => {
        if (e.target.type == 'number') {
            const invalid = [ '+', '-', 'e' ]

            if (invalid.includes(e.key)) {
                e.preventDefault()
                return
            }
        }

        if (e.key == 'Enter') {
            const index = +e.target.getAttribute('data-index')
            const next: any = document.querySelector(`[data-index="${index+1}"]`)

            e.target.blur()

            if (next) {
                next.focus()
            }

            else {
                if (!disabled()) {
                    submit()
                }
            }
        }
    }

    useEffect(() => {
        setMobile(window.innerWidth <= 720)
        const onResize = (e: any) => setMobile(window.innerWidth <= 720)
        
        window.addEventListener('resize', onResize)

        return () => {
            window.removeEventListener('resize', onResize)
        }
    }, [])

    const toggleFocus = (e: any) => {
        const par = e.target.parentNode;
        const label = par.getElementsByTagName('label')[0]
        label.classList.toggle('focus')
    }

    const onISBNInputFocus = (e: any) => {
        if (e) {
            toggleFocus(e)
        }

        errorsRef.current = { ...errorsRef.current, isbn: '' } 
        setErrorMessages(errorsRef.current)
    }

    const onISBNInputBlur = async (e: any) => {
        if (e) {
            e.target.value = book.isbn
            toggleFocus(e)
        }

        if (book.isbn == '') {
            errorsRef.current = { ...errorsRef.current, isbn: 'isbn cannot be empty' } 
            return setErrorMessages(errorsRef.current)
        }

        if (book.isbn.indexOf(' ') != -1) {
            errorsRef.current = { ...errorsRef.current, isbn: 'isbn contains spaces' } 
            return setErrorMessages(errorsRef.current)
        }

        try {
            const info: any = {}
            const { status, title, authors, publisher, categories, coverSrc } = await booksApi.fetchAndProcessInfo(book.isbn)
        
            if (!status) {
                errorsRef.current = { ...errorsRef.current, isbn: "couldn't find books with this isbn" } 
                return setErrorMessages(errorsRef.current)
            }

            info.title = title 
            info.authors = authors.join(', ')
            info.publisher = publisher
            info.categories = categories.join(', ')
            info.coverSrc = coverSrc

            if (!mode) {
                const bookRes = await booksApi.fetchUserBookInfo(book.isbn)

                if (bookRes.status != 200) {
                    errorsRef.current = { ...errorsRef.current, isbn: "book not in user library" } 
                    return setErrorMessages(errorsRef.current)
                }

                info.nCount = bookRes.data.count
            }

            setBookInfo(info)
        }

        catch (error) {
            errorsRef.current = { ...errorsRef.current, isbn: 'failed to fetch book details' } 
            return setErrorMessages(errorsRef.current)
        }
    }

    const onCountInputFocus = (e: any) => {
        if (e) {
            toggleFocus(e)
        }

        errorsRef.current = { ...errorsRef.current, nCount: '' } 
        setErrorMessages(errorsRef.current)
    }

    const onCountInputBlur = async (e: any) => {
        if (e) {
            toggleFocus(e)
        }

        if (book.nCount <= 0) {
            errorsRef.current = { ...errorsRef.current, nCount: 'invalid count' } 
            return setErrorMessages(errorsRef.current)
        }
    }

    const toggleMode = () => {
        mode = ++mode % 2
        setMode(mode)
        setBookInfo({ title: '',  authors: '', categories: '', publisher: '', nCount: 0, coverSrc: '' })
        
        if (book.isbn != '') {
            setErrorMessages(errorsRef.current)
            onISBNInputBlur(null)
        }

        setStatusMessage({ msg: "", color: '' })
    }

    const submit = async () => {
        if (submitting) {
            return false
        }

        setSubmitting(true)
        
        let failed = false 

        if (book.isbn == '') {
            failed = true
            errorMessages.isbn = 'isbn cannot be empty'
        }

        if (!book.nCount || book.nCount < 0) {
            failed = true
            errorMessages.nCount = 'invalid count'
        }

        if (failed) {
            setSubmitting(false)
            errorsRef.current = { ...errorsRef.current }
            return setErrorMessages(errorsRef.current)
        }

        if (bookInfo.title == '') {
            if (mode) {
                const bookRes = await booksApi.fetchInfo(book.isbn)
                
                if (bookRes.status != 200) {
                    setSubmitting(false)
                    errorsRef.current = { ...errorsRef.current, isbn: "couldn't find books with this isbn" } 
                    return setErrorMessages(errorsRef.current)
                }
            }

            else {
                const bookRes = await booksApi.fetchUserBookInfo(book.isbn)

                if (bookRes.status != 200) {
                    setSubmitting(false)
                    errorsRef.current = { ...errorsRef.current, isbn: "book not in user library" } 
                    return setErrorMessages(errorsRef.current)
                }
            }   
        }

        if (mode) {
            try {
                var res = await booksApi.addToUser({
                    isbn: book.isbn,
                    nCount: book.nCount
                })
            }
            catch (error: any) {
                setSubmitting(false)
                return setStatusMessage({ msg: error.response.data.message ?? 'unknown error occured', color: '#fd9595' })
            }

            if (res.status != 200) {
                setSubmitting(false)
                return setStatusMessage({ msg: res.data.message ?? 'unknown error occured', color: '#fd9595' })
            }

            setStatusMessage({ msg: `${book.nCount} copies of book ${book.isbn} has been added to user library`,  color: '#61c77c'})
        }

        else {
            try {
                var res = await booksApi.removeFromUser(book)
            }
            catch (error: any) {
                setSubmitting(false)
                return setStatusMessage({ msg: error.response.data.message ?? 'unknown error occured', color: '#fd9595' })
            }

            if (res.status != 200) {
                setSubmitting(false)
                return setStatusMessage({ msg: res.data.message ?? 'unknown error occured', color: '#fd9595' })
            }

            setBookInfo({ ...bookInfo, nCount: bookInfo.nCount - book.nCount })
            setStatusMessage({ msg: `${book.nCount} copies of book ${book.isbn} has been removed from user library`,  color: '#61c77c'})
        }

        props.refresh()
        setSubmitting(false)
    }

    return (
        <ThemeProvider theme={{mode, primary: '#A58FFF', secondary: '#FFA5A5' }}>
            <S.AddOrRemoveBook>
                <S.CloseButton onClick={props.close}>
                    <S.CloseSpan />
                    <S.CloseSpan />
                </S.CloseButton>

                <S.Title> Book</S.Title>
                <S.Form>
                    <S.FormPart>
                        <S.Inputs>
                            <TextInput style={{ width: '100%' }}>
                                <TextInputInner>
                                    <Label textLength={3}>isbn</Label>
                                    <TextBox data-index="1" onKeyDown={onKeyDown} error={errorMessages.isbn != ''} onChange={(e) => setBook({ ...book, isbn: e.target.value.trim() })} onFocus={onISBNInputFocus} onBlur={onISBNInputBlur}/>
                                </TextInputInner>
                                <ErrorMessage>{errorMessages.isbn}</ErrorMessage>
                            </TextInput>

                            <TextInput style={{ width: '65%' }}>
                                <TextInputInner>
                                    <Label textLength={mobile ? 2.6 : 3}>count</Label>
                                    <TextBox type="number" data-index="2" onKeyDown={onKeyDown} error={errorMessages.nCount != ''} onChange={(e) => setBook({ ...book, nCount: +e.target.value })} onFocus={onCountInputFocus} onBlur={onCountInputBlur} />
                                </TextInputInner>
                                <ErrorMessage>{errorMessages.nCount}</ErrorMessage>
                            </TextInput>
                        </S.Inputs>

                        { bookInfo.title && 
                            <S.InfoGrid>
                                <S.InfoCell>
                                    <S.CellTitle>Title</S.CellTitle>
                                    <S.CellValue>{bookInfo.title}</S.CellValue>
                                </S.InfoCell>

                                <S.InfoCell>
                                    <S.CellTitle>Author(s)</S.CellTitle>
                                    <S.CellValue>{bookInfo.authors}</S.CellValue>
                                </S.InfoCell>

                                <S.InfoCell>
                                    <S.CellTitle>Categories</S.CellTitle>
                                    <S.CellValue>{bookInfo.categories}</S.CellValue>
                                </S.InfoCell>

                                <S.InfoCell>
                                    <S.CellTitle>{mode ? 'Publisher' : 'Count'}</S.CellTitle>
                                    <S.CellValue>{mode ? bookInfo.publisher : bookInfo.nCount }</S.CellValue>
                                </S.InfoCell>

                                { mobile && bookInfo.coverSrc != '' &&
                                    <S.InfoCell>
                                        <S.BookCover src={bookInfo.coverSrc} />
                                    </S.InfoCell> 
                                }
                            </S.InfoGrid>
                        }
                    </S.FormPart>
                        
                    { !mobile && 
                        <S.FormPart>
                            {bookInfo.coverSrc && 
                                <S.BookCover src={bookInfo.coverSrc} />
                            }
                        </S.FormPart>   
                    }
                </S.Form>

                { !submitting 
                    ? <S.StatusMessage color={statusMessage.color}>{statusMessage.msg}</S.StatusMessage>
                    : 
                    <S.LoadingContainer>
                        <PropagateLoader color={mode ? '#A58FFF' : '#FFA5A5'} size={7} />
                    </S.LoadingContainer>
                }

                <S.SubmitDiv>
                    <S.Toggle onClick={toggleMode}>
                        {!mode ? 'add' : 'remove'} book instead
                    </S.Toggle>

                    <Submit onClick={submit} disabled={disabled()}>
                        <SubmitSpan />
                        <SubmitSpan />
                    </Submit>
                </S.SubmitDiv>
            </S.AddOrRemoveBook>
        </ThemeProvider>
    )
}

export default AddOrRemoveBook