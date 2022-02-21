import React, { useState, useRef, useEffect } from 'react'
import { ThemeProvider } from 'styled-components'
import PropagateLoader from 'react-spinners/PropagateLoader'
import PulseLoader from 'react-spinners/PulseLoader'

import * as studentsApi from '../../api/students'
import * as booksApi from '../../api/books'
import * as S from './BorrowOrReturnBookStyles'
import { SubmitContainer, Submit, SubmitSpan } from '../SignInOrUp/SignInOrUpStyles'
import { LoadingContainer, StatusMessage } from '../AddOrRemoveBook/AddOrRemoveBookStyles'
import { CloseButton, CloseSpan } from '../AddStudent/AddStudentStyles'
import Alert from '../Alert/Alert'

const BorrowOrReturnBook = (props: any) => {
    const [ inputs, setInputs ] = useState<any>({ admNo: '', isbn: '', duration: 7 })
    const [ errorMessages, setErrorMessages ] = useState<any>({ admNo: '', isbn: '' })
    const [ statusMessage, setStatusMessage ] = useState<any>({ msg: '', color: '' })
    const [ submitting, setSubmitting ] = useState<boolean>(false)
    const [ borrowing, setBorrowing ] = useState<any>()
    let [ studentInfo, setStudentInfo ] = useState<any>({ name: '', branch: '', batch: '', phone: '' })
    let [ bookInfo, setBookInfo ] = useState<any>({ title: '', authors: [], count: '' })
    const [ showAlert, setShowAlert ] = useState<boolean>(false)
    const [ alertInfo, setAlertInfo ] = useState<any>({ admNo: 0, overdue: '', cancel: null, proceed: null })
    const [ students, setStudents ] = useState<any[]>([])
    const [studentsLoading, setStudentsLoading] = useState<boolean>(false)
    const [ books, setBooks ] = useState<any[]>([])
    const [ booksLoading, setBooksLoading ] = useState<boolean>(false)
    const errorsRef = useRef(errorMessages)
    const loadedAll = useRef({ books: true, students: true })
    const loading = useRef({ books: false, students: false })
    const limit = 31;

    const fetchBooks = async (query?: any, append?: boolean) => {
        setBooksLoading(true)
        loading.current.books = true 

        if (!append) {
            loadedAll.current.books = false
        }

        try {
            var res = await booksApi.fetch({ 
                limit,
                ...query
            })
        }
        
        catch (error) {
            fetchBooks(query, append)
            return 
        }

        const resBooks = res.data.books

        if (resBooks.length < limit) {
            loadedAll.current.books = true
        }

        if (append) {
            setBooks(books.concat(resBooks.slice(0, limit - (resBooks.length == limit ? 1 : 0))))
        }

        else {
            setBooks(resBooks.slice(0, limit - (resBooks.length == limit ? 1 : 0)))
        }

        setBooksLoading(false)
        loading.current.books = false
    }

    const fetchStudents = async (query?: any, append?: boolean) => {
        setStudentsLoading(true)
        loading.current.students = true

        if (!append) {
            loadedAll.current.students = false
        }

        try {
            var res = await studentsApi.fetch({ 
                limit,
                ...query
            })
        }
        
        catch (error) {
            fetchStudents(query, append)
            return 
        }

        const resStudents = res.data.students

        if (resStudents.length < limit) {
            loadedAll.current.students = true
        }

        if (append) {
            setStudents(students.concat(resStudents.slice(0, limit - (resStudents.length == limit ? 1 : 0))))
        }
        else {
            setStudents(resStudents.slice(0, limit - (resStudents.length == limit ? 1 : 0)))
        }

        setStudentsLoading(false)
        loading.current.students = false
    }

    const onStudentsSearchScroll = async (e: any) => {        
        if (loadedAll.current.students || loading.current.students) {
            return
        }

        const bottom = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight
        
        if (bottom <= 20) {
            fetchStudents({ search: inputs.admNo, after: students[students.length - 1].admNo }, true)
        }
    }

    const onStudentsInputChange = async (e: any) => {
        setInputs({...inputs, admNo: e.target.value})
        const studentSearch = e.target.value
        
        setStudents([])
        setStudentsLoading(true)

        setTimeout(() => {
            if (e.target.value != studentSearch) {
                return
            }

            fetchStudents({ search: studentSearch }, false)
        }, 300)
    }

    const onBooksSearchScroll = async (e: any) => {
        if (loadedAll.current.books || loading.current.books) {
            return
        }

        const bottom = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight
        
        if (bottom <= 20) {
            fetchBooks({ search: inputs.isbn, after: books[books.length - 1].isbn }, true)
        }
    }

    const onBooksInputChange = async (e: any) => {
        setInputs({...inputs, isbn: e.target.value})
        const bookSearch = e.target.value
        
        setBooks([])
        setBooksLoading(true)

        setTimeout(() => {
            if (e.target.value != bookSearch) {
                return
            }

            fetchBooks({ search: bookSearch }, false)
        }, 300)
    }

    useEffect(() => {
        fetchBooks()
        fetchStudents()
    }, [])

    const disabled = () => {
        return Object.keys(errorMessages).some(x => errorMessages[x] != '')
    }

    const onKeyDown = (e: any) => {
        if (e.key == 'Enter') {
            const index = +e.target.getAttribute('data-index')
            const next: any = document.querySelector(`[data-index="${index+1}"]`)
    
            e.target.blur()

            if (next) {
                next.focus()
            }
         
            else {
                if (!disabled()) {
                    submit(null)
                }
            }
        }
    }

    const toggleFocus = (e: any) => {
        const par = e.target.parentNode
        const label = par.parentNode.getElementsByTagName('label')[0]
        
        par.classList.toggle('focus')
        label.classList.toggle('focus')   
    }

    const onAdmnoInputFocus = (e: any) => {
        if (e) {
            toggleFocus(e)
        }
    }

    const onAdmnoInputBlur = async (e: any) => {
        if (e) {
            toggleFocus(e)
        }

        const admNo = +inputs.admNo

        if (!admNo || admNo < 0) {
            errorsRef.current = { ...errorsRef.current, admNo: 'invalid admission number' } 
            return setErrorMessages(errorsRef.current)
        }

        try {
            const res = await studentsApi.fetchInfo(admNo)
            setStudentInfo({ name: res.data.name, branch: res.data.branch, batch: res.data.batch, phone: res.data.phone })

            errorsRef.current = { ...errorsRef.current, admNo: '' }
            return setErrorMessages(errorsRef.current)
        }

        catch (error) { 
            errorsRef.current = { ...errorsRef.current, admNo: `student with admission number ${admNo} does not exist` } 
            return setErrorMessages(errorsRef.current)
        }
    }

    const onIsbnInputFocus = async (e: any) => {
        if (e) {
            toggleFocus(e)
        }
    }

    const onIsbnInputBlur = async (e: any) => {
        if (e) {
            e.target.value = inputs.isbn
            toggleFocus(e)
        }

        if (inputs.isbn == '') {
            errorsRef.current = { ...errorsRef.current, isbn: `isbn cannot be empty` } 
            return setErrorMessages(errorsRef.current)
        }

        try {
            const res = await booksApi.fetchUserBookInfo(inputs.isbn)
            const info: any = { title: res.data.title, authors: (res.data.authors as any[]).map(a => a.name).join(', '), count: res.data.count }

            setBookInfo(info)

            errorsRef.current = { ...errorsRef.current, isbn: '' }
            return setErrorMessages(errorsRef.current)
        }

        catch (error) {
            errorsRef.current = { ...errorsRef.current, isbn: `no book in user library with isbn ${inputs.isbn}` } 
            return setErrorMessages(errorsRef.current)
        }
    }

    const onStudentSearchEntryClick = (e: any) => {
        let target = e.target
        if (target instanceof HTMLLabelElement) {
            target = target.parentNode
        }

        const admNo = target.children[1].innerHTML
        const input = target.parentNode.parentNode.children[0]
        input.value = admNo

        inputs.admNo = admNo
        setInputs({ ...inputs, admNo })
    }

    const onBooksSearchEntryClick = (e: any) => {
        let target = e.target
        if (target instanceof HTMLLabelElement) {
            target = target.parentNode
        }

        const isbn = target.children[1].innerHTML
        const input = target.parentNode.parentNode.children[0]
        input.value = isbn

        inputs.isbn = isbn
        setInputs({ ...inputs, isbn })
    }

    const submit = async (e: any) => {
        setStatusMessage({ msg: '', color: '' })

        if (borrowing == undefined) {
            return setStatusMessage({ msg: 'set whether student is borrowing or returning a book', color: '#fd9595' }) 
        }

        let fail = 0

        if (submitting) {
            return 
        }

        setSubmitting(true)

        const admNo = +inputs.admNo

        if (!admNo || admNo < 0) {
            fail = 1
            errorsRef.current = { ...errorsRef.current, admNo: 'invalid admission number' } 
        }

        if (inputs.isbn == '') {
            fail = 1;
            errorsRef.current = { ...errorsRef.current, isbn: 'isbn cannot be empty' } 
        }

        if (fail) {
            setSubmitting(false)
            return setErrorMessages(errorsRef.current)
        }

        try {
            if (borrowing) {
                let borrowDate = new Date()

                let dueDate = new Date()
                dueDate.setDate(dueDate.getDate() + inputs.duration)

                const res = await studentsApi.fetchOverdue(admNo)
                const overdue = res.data.overdue as any[]

                const proceed = async () => {
                    try {
                        await studentsApi.borrowBook({ admNo, isbn: inputs.isbn, dueDate, borrowDate })

                        setStatusMessage({ msg: `copy of book ${inputs.isbn} has been borrowed by student ${inputs.admNo}`, color: '#61c77c' })
                        setSubmitting(false)
                        
                        props.refresh()
                    }

                    catch (error: any) {
                        setStatusMessage({ msg: error.response.data.message ?? 'unknown error occured', color: '#fd9595' })            
                        setSubmitting(false)
                    }

                    return setShowAlert(false)
                }

                const cancel = () => {
                    setSubmitting(false)
                    setShowAlert(false)
                }

                if (overdue.length > 0) {
                    setAlertInfo({
                        admNo, 
                        overdue,
                        cancel,
                        proceed
                    })

                    return setShowAlert(true)
                }

                await proceed()
            }

            else {
                await studentsApi.returnBook({ admNo, isbn: inputs.isbn })
                
                props.refresh()
                setStatusMessage({ msg: `copy of book ${inputs.isbn} has been returned to user library`, color: '#61c77c' })
            }
            
            return setSubmitting(false)
        }

        catch (error: any) {
            setSubmitting(false)
            return setStatusMessage({ msg: error.response.data.message ?? 'unknown error occured', color: '#fd9595' })            
        }
    }
    
    return (
        <S.BorrowOrReturnBook>
            <CloseButton onClick={props.close}>
                <CloseSpan />
                <CloseSpan />
            </CloseButton>

            {showAlert &&
                <S.AlertContainer>
                    <Alert {...alertInfo} />
                </S.AlertContainer>
            }

            <S.Title>Student is</S.Title>

            <S.BorrowOrReturnButtons>
                <S.BorrowButton className={ borrowing == true ? 'activated' : '' } onClick={() => setBorrowing(true)}>Borrowing</S.BorrowButton>
                <S.ReturnButton className={ borrowing == false ? 'activated' : '' } onClick={() => setBorrowing(false)}>Returning</S.ReturnButton>
            </S.BorrowOrReturnButtons>

            <S.Inputs>
                <ThemeProvider theme={{color: '#BAC7D2', fontColor: '#7296B8'}}>
                    <S.InputContainer>
                        <S.TextInput>
                            <S.TextInputInner>
                                <S.Label>Student admno</S.Label>

                                <S.TextBoxWithSearch error={errorMessages.admNo != ''}>
                                    <S.TextBox data-index='1' onKeyDown={onKeyDown} onChange={onStudentsInputChange} onFocus={onAdmnoInputFocus} onBlur={(e) => setTimeout(() => onAdmnoInputBlur(e), 150)} />    
                                    <S.InputSearch onScroll={onStudentsSearchScroll}>
                                        {students.map((s, i) => (
                                            <S.InputSearchEntry key={i} onClick={onStudentSearchEntryClick}>
                                                <S.InputSearchHead>{s.name}</S.InputSearchHead>
                                                <S.InputSearchValue>{s.admNo}</S.InputSearchValue>
                                            </S.InputSearchEntry>
                                        ))}

                                        {studentsLoading &&
                                            <LoadingContainer style={{ marginBottom: 5 }}>
                                                <PulseLoader color={'#616161'} size={5} />
                                            </LoadingContainer>
                                        }
                                    </S.InputSearch> 
                                </S.TextBoxWithSearch> 
                            </S.TextInputInner>
                            <S.ErrorMessage>{errorMessages.admNo}</S.ErrorMessage>
                        </S.TextInput>

                        <S.Grid>
                            <S.GridCell>
                                <S.GridCellHead>Name</S.GridCellHead>
                                <S.GridCellValue>{studentInfo.name}</S.GridCellValue>
                            </S.GridCell>

                            <S.GridCell>
                                <S.GridCellHead>Branch</S.GridCellHead>
                                <S.GridCellValue>{studentInfo.branch}</S.GridCellValue>
                            </S.GridCell>

                            <S.GridCell>
                                <S.GridCellHead>Batch</S.GridCellHead>
                                <S.GridCellValue>{studentInfo.batch}</S.GridCellValue>
                            </S.GridCell>

                            <S.GridCell>
                                <S.GridCellHead>Contact No</S.GridCellHead>
                                <S.GridCellValue>{studentInfo.phone}</S.GridCellValue>
                            </S.GridCell>
                        </S.Grid>
                    </S.InputContainer>
                </ThemeProvider>

                <ThemeProvider theme={{color: '#D1BEDC', fontColor: '#AD7EC9'}}>
                    <S.InputContainer>
                        <S.TextInput>
                            <S.TextInputInner>
                                <S.Label>Book isbn</S.Label>

                                <S.TextBoxWithSearch error={errorMessages.isbn != ''}>
                                    <S.TextBox data-index='2' onKeyDown={onKeyDown} onChange={onBooksInputChange} onFocus={onIsbnInputFocus} onBlur={(e) => setTimeout(() => onIsbnInputBlur(e), 150)} />   
                                    <S.InputSearch onScroll={onBooksSearchScroll}>
                                        {books.map((b, i) => (
                                            <S.InputSearchEntry key={i} onClick={onBooksSearchEntryClick}>
                                                <S.InputSearchHead>{b.title}</S.InputSearchHead>
                                                <S.InputSearchValue>{b.isbn}</S.InputSearchValue>
                                            </S.InputSearchEntry>
                                        ))}

                                        {booksLoading &&
                                            <LoadingContainer style={{ marginBottom: 5 }}>
                                                <PulseLoader color={'#616161'} size={5} />
                                            </LoadingContainer>
                                        }
                                    </S.InputSearch> 
                                </S.TextBoxWithSearch> 
                            </S.TextInputInner>
                            <S.ErrorMessage>{errorMessages.isbn}</S.ErrorMessage>
                        </S.TextInput>

                        <S.BorrowDuration className={borrowing ? 'show' : ''}>
                            <S.DurationSelect onChange={(e => setInputs({ ...inputs, duration: +e.target.value }))}>
                                <S.DurationOption value={7}>7 Days</S.DurationOption>
                                <S.DurationOption value={14}>14 Days</S.DurationOption>
                                <S.DurationOption value={30}>30 Days</S.DurationOption>
                            </S.DurationSelect>
                        </S.BorrowDuration>

                        <S.Grid>
                            <S.GridCell>
                                <S.GridCellHead>Title</S.GridCellHead>
                                <S.GridCellValue>{bookInfo.title}</S.GridCellValue>
                            </S.GridCell>

                            <S.GridCell>
                                <S.GridCellHead>Authors</S.GridCellHead>
                                <S.GridCellValue>{bookInfo.authors}</S.GridCellValue>
                            </S.GridCell>

                            <S.GridCell>
                                <S.GridCellHead>Count</S.GridCellHead>
                                <S.GridCellValue>{bookInfo.count}</S.GridCellValue>
                            </S.GridCell>
                        </S.Grid>
                    </S.InputContainer>
                </ThemeProvider>
            </S.Inputs>

            { !submitting 
                ? <StatusMessage color={statusMessage.color}>{statusMessage.msg}</StatusMessage>
                : 
                <LoadingContainer style={{ marginBottom: 30 }}>
                    <PropagateLoader color={'#616161'} size={7} />
                </LoadingContainer>
            }

            <SubmitContainer>
                <Submit disabled={disabled()} onClick={submit}>
                    <SubmitSpan />
                    <SubmitSpan />
                </Submit>
            </SubmitContainer>
        </S.BorrowOrReturnBook>
    )
}

export default BorrowOrReturnBook