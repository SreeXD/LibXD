import React, { useState, useEffect, useRef } from 'react'
import HashLoader from 'react-spinners/HashLoader'

import * as studentsApi from '../../api/students' 
import * as booksApi from '../../api/books' 
import * as S from './BorrowedListStyles'
import * as S2 from '../BooksList/BooksListStyles'
import * as S3 from '../StudentsList/StudentsListStyles'
import * as GS from '../General/Styles'
import BookInfo from '../BookInfo/BookInfo'
import StudentInfo from '../StudentInfo/StudentInfo'
import BorrowOrReturnBook from '../BorrowOrReturnBook/BorrowOrReturnBook'
import List from '../List/List'

import { formatDate, clearTimeFromDate, stringToDate } from '../../utils/utils'

const BorrowedList = (props: any) => {
    const [mouse, setMouse] = useState<any>({ x: 0, y: 0 })
    const [loading, setLoading] = useState<boolean>(true)
    const [borrowed, setBorrowed] = useState<any[]>([] as any[])
    const [bookInfo, setBookInfo] = useState<any>({ title: '', publisher: '', authors: [], categories: [], coverSrc: '' })
    const [bookInfoLoading, setBookInfoLoading] = useState<boolean>(false)
    let [studentInfo, setStudentInfo] = useState<any>({ admNo: 0, name: '', branch: '', batch: '', phone: '', borrowed: [] as any[] })
    const [showStudentInfo, setShowStudentInfo] = useState<boolean>(false)
    const [studentInfoLoading, setStudentInfoLoading] = useState<boolean>(false)
    const [borrowOrReturnBook, setBorrowOrReturnBook] = useState<boolean>(false)
    const [control, setControl] = useState<any>({ leftActive: false, rightActive: false })
    const [range, setRange] = useState<any>({ start: 0, end: 0 })
    const [search, setSearch] = useState<any>("")
    const limit = 31
    const today = useRef<Date>(new Date())
    let controller = useRef<AbortController>()

    const searchHandler = async (search: string) => {
        setSearch(search)
        fetchBorrowed({ search })
    }

    const fetchBorrowed = async (query?: any) => {
        setLoading(true)
        
        try {
            var res = await booksApi.fetchBorrowed({ 
                limit,
                ...query
            })
        }
        
        catch (error) {
            fetchBorrowed(query)
            return 
        }

        const resBorrowed = res.data.borrowed

        if (query?.afterDate) {
            setRange({ start: range.start + limit - 1, end: range.end + Math.min(limit - 1, resBorrowed.length) })
            setControl({ leftActive: true, rightActive: resBorrowed.length == limit })
            setBorrowed(resBorrowed.slice(0, limit - (resBorrowed.length == limit ? 1 : 0)))
        }

        else if (query?.beforeDate) {
            setRange({ start: range.start - Math.min(limit - 1, resBorrowed.length), end: range.start - 1 })
            setControl({ leftActive: resBorrowed.length == limit, rightActive: true })
            setBorrowed(resBorrowed.slice((resBorrowed.length == limit ? 1 : 0), limit))
        }

        else {
            setRange({ start: Math.min(resBorrowed.length, 1), end: Math.min(limit - 1, resBorrowed.length) })
            setControl({ leftActive: false, rightActive: resBorrowed.length == limit })
            setBorrowed(resBorrowed.slice(0, limit - (resBorrowed.length == limit ? 1 : 0)))
        }
        
        setLoading(false)
    }

    useEffect(() => {
        fetchBorrowed()

        const onMouseMove = (e: any) => {
            setMouse({ x: e.clientX, y: e.clientY })
        }

        window.addEventListener('mousemove', onMouseMove)

        return () => {
            window.removeEventListener('mousemove', onMouseMove)
        }
    }, [])

    useEffect(() => {
        today.current = new Date()
        clearTimeFromDate(today.current)

        const bookInfoEle = document.getElementById('book-info')
            
        if (!bookInfoEle) { 
            return 
        }

        const bookInfoEleBB = bookInfoEle.getBoundingClientRect()
        
        if (mouse.x <= window.innerWidth / 2) {
            bookInfoEle.style.right = 'auto'
            bookInfoEle.style.left = Math.max(10, mouse.x - bookInfoEleBB.width / 2) + 'px'
        }
        
        else {
            bookInfoEle.style.left = 'auto'
            bookInfoEle.style.right = Math.max(10, window.innerWidth - mouse.x - bookInfoEleBB.width / 2) + 'px'
        }
    })

    const onAdmnoCellClick = async (admno: number) => {
        setStudentInfoLoading(true)
        setShowStudentInfo(true)
        
        const res = await studentsApi.fetchInfo(admno)
        const studentData = res.data 
        
        studentInfo = { ...studentInfo, ...studentData }
        
        setStudentInfo(studentInfo)
        setStudentInfoLoading(false)
    }

    const onIsbnCellClick = async (e: any, isbn: string) => {
        setBookInfoLoading(true)
        const bookInfoEle = document.getElementById('book-info')

        if (!bookInfoEle) {
            return;
        }

        bookInfoEle.style.visibility = 'visible'

        const parent = e.target.parentNode
        const parentBB = parent.getBoundingClientRect()

        if (e.clientY >= window.innerHeight / 2) {
            bookInfoEle.style.top = 'auto'
            bookInfoEle.style.bottom = window.innerHeight - parentBB.top + 5 + 'px'
            bookInfoEle.style.transformOrigin = 'bottom center'
        }

        else {
            bookInfoEle.style.bottom = 'auto'
            bookInfoEle.style.top = parentBB.top + parentBB.height + 5 + 'px'
            bookInfoEle.style.transformOrigin = 'top center'
        }

        if (controller.current) {
            controller.current.abort()
        }
        
        const { status, title, authors, publisher, categories, coverSrc } = await booksApi.fetchAndProcessInfo(isbn, controller)

        if (!status) {
            return
        }

        const info: any = {}
        info.title = title 
        info.authors = authors
        info.publisher = publisher
        info.categories = categories 
        info.coverSrc = coverSrc
        
        setBookInfo(info)
        setBookInfoLoading(false)
    }

    const onIsbnCellLeave = async () => {
        const bookInfoEle = document.getElementById('book-info')

        if (bookInfoEle) {
            bookInfoEle.style.visibility = 'hidden'
        }

        if (controller.current) {
            controller.current.abort()
        }

        setBookInfoLoading(true)
    }

    return (
        <List title="Lent books" 
            primary="#414141" 
            controlAdd={() => setBorrowOrReturnBook(true)} 
            controlRight = {() => fetchBorrowed({ search, afterDate: borrowed[borrowed.length - 1].dueDate, afterId: borrowed[borrowed.length - 1].id })}
            controlRightActive = {control.rightActive}
            controlLeft = {() => fetchBorrowed({ search, beforeDate: borrowed[0].dueDate, beforeId: borrowed[0].id })}
            controlLeftActive = {control.leftActive}
            searchHandler = {searchHandler}
            range={range}
            close={props.close}>

            { borrowOrReturnBook &&
                <S.BorrowOrReturnBookContainer>
                    <GS.Bg onClick={() => setBorrowOrReturnBook(false)} />
                    <BorrowOrReturnBook 
                        close={() => setBorrowOrReturnBook(false)}
                        refresh={() => {
                            setControl({ leftActive: false, rightActive: false })
                            fetchBorrowed({ search })
                        }}
                    />
                </S.BorrowOrReturnBookContainer>
            }

            { loading &&
                <GS.LoadingContainer>
                    <HashLoader size={22} color='#212121' />
                </GS.LoadingContainer>
            }

            { !loading &&
                <>
                    { showStudentInfo && 
                        <S3.StudentInfoContainer>
                            <GS.Bg onClick={() => setShowStudentInfo(false)} />
                            { studentInfoLoading &&
                                <GS.LoadingContainer>
                                    <HashLoader size={30} />
                                </GS.LoadingContainer>
                            }

                            { !studentInfoLoading &&
                                <StudentInfo studentInfo={studentInfo} setShowStudentInfo={setShowStudentInfo} />
                            }
                        </S3.StudentInfoContainer>
                    }

                    <S2.BookInfo id='book-info'>
                        {!bookInfoLoading &&
                            <BookInfo bookInfo={bookInfo} />
                        }

                        {bookInfoLoading && 
                            <GS.LoadingContainer>
                                <HashLoader size={20} color='#212121' />
                            </GS.LoadingContainer>
                        }
                    </S2.BookInfo>

                    <GS.TableContainer>
                        <GS.Table>
                            <tbody>
                                <GS.TableRow>
                                    <GS.TableHeader>Student admno</GS.TableHeader>
                                    <GS.TableHeader>Isbn</GS.TableHeader>
                                    <GS.TableHeader>Date of borrow</GS.TableHeader>
                                    <GS.TableHeader>Due date</GS.TableHeader>
                                </GS.TableRow>

                                {borrowed.map((b, i) => (
                                    <GS.TableRow key={i} className={ stringToDate(b.dueDate) < today.current ? 'overdue' : '' }>
                                        <GS.TableData onClick={e => onAdmnoCellClick(b.admNo)}>
                                            <S.TableDataInner>
                                                <S.TableDataUpper>{b.admNo}</S.TableDataUpper>
                                                <S.TableDataUnder>{b.name}</S.TableDataUnder>
                                            </S.TableDataInner>
                                        </GS.TableData>

                                        <GS.TableData onClick={e => onIsbnCellClick(e, b.isbn)} onMouseLeave={onIsbnCellLeave}>
                                            <S.TableDataInner style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
                                                <S.TableDataUpper>{b.isbn}</S.TableDataUpper>
                                                <S.TableDataUnder>{b.title}</S.TableDataUnder>
                                            </S.TableDataInner>
                                        </GS.TableData>

                                        <GS.TableData>{formatDate(b.borrowDate)}</GS.TableData>
                                        <GS.TableData>{formatDate(b.dueDate)}</GS.TableData>
                                    </GS.TableRow>
                                ))}
                            </tbody>
                        </GS.Table>
                    </GS.TableContainer>
                </>
            }

        </List>
    )
}

export default BorrowedList