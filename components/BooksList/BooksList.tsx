import React, { useEffect, useRef, useState } from 'react'
import HashLoader from 'react-spinners/HashLoader'

import * as booksApi from '../../api/books'
import * as S from './BooksListStyles'
import * as GS from '../General/Styles'
import List from '../List/List'
import BookInfo from '../BookInfo/BookInfo'
import AddOrRemoveBook from '../AddOrRemoveBook/AddOrRemoveBook'

const BooksList = (props: any) => {
    const [mouse, setMouse] = useState<any>({ x: 0, y: 0 })
    const [loading, setLoading] = useState<boolean>(true)
    const [infoLoading, setInfoLoading] = useState<boolean>(true)
    const [addOrRemove, setAddOrRemove] = useState<any>({ flag: false, mode: 1 })
    const [bookInfo, setBookInfo] = useState<any>({ title: '', publisher: '', authors: [], categories: [], coverSrc: '' })
    const [books, setBooks] = useState<any[]>([])
    const [control, setControl] = useState<any>({ leftActive: false, rightActive: false })
    const [range, setRange] = useState<any>({ start: 0, end: 0 })
    const [search, setSearch] = useState<string>("")
    const limit = 31
    let controller = useRef<AbortController>()

    const searchHandler = async (search: string) => {
        setSearch(search)
        fetchBooks({ search })
    }

    const fetchBooks = async (query?: any) => {
        setLoading(true)
        
        try {
            var res = await booksApi.fetch({ 
                limit,
                ...query
            })
        }
        
        catch (error) {
            fetchBooks(query)
            return 
        }

        const resBooks = res.data.books

        if (query?.after) {
            setRange({ start: range.start + limit - 1, end: range.end + Math.min(limit - 1, resBooks.length) })
            setControl({ leftActive: true, rightActive: resBooks.length == limit })
            setBooks(resBooks.slice(0, limit - (resBooks.length == limit ? 1 : 0)))
        }

        else if (query?.before) {
            setRange({ start: range.start - Math.min(limit - 1, resBooks.length), end: range.start - 1 })
            setControl({ leftActive: resBooks.length == limit, rightActive: true })
            setBooks(resBooks.slice((resBooks.length == limit ? 1 : 0), limit))
        }

        else {
            setRange({ start: Math.min(resBooks.length, 1), end: Math.min(limit - 1, resBooks.length) })
            setControl({ leftActive: false, rightActive: resBooks.length == limit })
            setBooks(resBooks.slice(0, limit - (resBooks.length == limit ? 1 : 0)))
        }

        setLoading(false)  
    }

    useEffect(() => {
        fetchBooks()
        
        const onMouseMove = (e: any) => {
            setMouse({ x: e.clientX, y: e.clientY })
        }

        window.addEventListener('mousemove', onMouseMove)

        return () => {
            window.removeEventListener('mousemove', onMouseMove)
        }
    }, [])

    useEffect(() => {
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

    const onRowClick = async (e: any) => {
        setInfoLoading(true)
        const bookInfoEle = document.getElementById('book-info')

        if (!bookInfoEle) {
            return
        }

        bookInfoEle.style.visibility = 'visible'

        const parent = e.target.parentNode;
        const isbnEle = parent.querySelector('.isbn')
        const isbn = isbnEle.innerHTML

        const parentBB = parent.getBoundingClientRect()

        if (e.clientY >= window.innerHeight / 2) {
            bookInfoEle.style.top = 'auto'
            bookInfoEle.style.bottom = window.innerHeight - parentBB.top + 'px'
            bookInfoEle.style.transformOrigin = 'bottom center'
        }

        else {
            bookInfoEle.style.bottom = 'auto'
            bookInfoEle.style.top = parentBB.top + parentBB.height + 'px'
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
        setInfoLoading(false)
    }

    const onRowLeave = () => {
        const bookInfoEle = document.getElementById('book-info')

        if (bookInfoEle) {
            bookInfoEle.style.visibility = 'hidden'
        }

        if (controller.current) {
            controller.current.abort()
        }

        setInfoLoading(true)
    }

    return (
        <List onScroll={() => onRowLeave()} 
            title="Books"
            primary="#7F5FFD" 
            secondary="#FA7979"
            controlAdd={() => setAddOrRemove({ flag: true, mode: 1 })} 
            controlRemove={() => setAddOrRemove({ flag: true, mode: 0 })} 
            controlRight = {() => fetchBooks({ search, after: books[books.length - 1].isbn })}
            controlRightActive = {control.rightActive}
            controlLeft = {() => fetchBooks({ search, before: books[0].isbn })}
            controlLeftActive = {control.leftActive}
            searchHandler = {searchHandler}
            range={range}
            close={props.close}>

            {addOrRemove.flag && 
                <S.AddOrRemoveBookContainer>
                    <GS.Bg onClick={() => setAddOrRemove({ ...addOrRemove, flag: false })} />
                    <AddOrRemoveBook 
                        initialMode={addOrRemove.mode} 
                        close={() => setAddOrRemove({ ...addOrRemove, flag: false })} 
                        refresh={() => {
                            setControl({ leftActive: false, rightActive: false })
                            fetchBooks({ search })
                        }} 
                    />
                </S.AddOrRemoveBookContainer>
            }

            <S.BookInfo id='book-info'>
                {!infoLoading &&
                    <BookInfo bookInfo={bookInfo} />
                }

                {infoLoading && 
                    <GS.LoadingContainer>
                        <HashLoader size={20} color='#212121' />
                    </GS.LoadingContainer>
                }
            </S.BookInfo>

            {loading &&
                <GS.LoadingContainer>
                    <HashLoader size={22} color='#212121' />
                </GS.LoadingContainer>
            }

            { !loading && 
                <GS.TableContainer>
                    <GS.Table>
                        <tbody>
                            <GS.TableRow>
                                <GS.TableHeader>Isbn</GS.TableHeader>
                                <GS.TableHeader>Title</GS.TableHeader>
                                <GS.TableHeader>Copies</GS.TableHeader>
                            </GS.TableRow>

                            {books.map((b, i) => (
                                <GS.TableRow key={i} onClick={onRowClick} onMouseLeave={onRowLeave}>
                                    <GS.TableData className='isbn'>{b.isbn}</GS.TableData>        
                                    <GS.TableData>{b.title}</GS.TableData>        
                                    <GS.TableData>{b.nCount}</GS.TableData>
                                </GS.TableRow>
                            ))}

                        </tbody>
                    </GS.Table>
                </GS.TableContainer>
            }
        </List>
    )
}

export default BooksList