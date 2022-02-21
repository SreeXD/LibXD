import axios from 'axios'

export const fetchInfo = (isbn: string) => axios.get(`${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API}/volumes?q=isbn:${isbn}`)

export const fetchAndProcessInfo = async (isbn: string, controller?: any) => {
    if (controller) {
        controller.current = new AbortController()
    }
    
    let bookRes;
    let bookInfo = { status: 0, title: '', authors: [], publisher: '', categories: [], coverSrc: '' }
    try {
        bookRes = await axios.get(`${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API}/volumes?q=isbn:${isbn}`, { 
            signal: controller && controller.current.signal 
        })
    }
    catch (error) {
        return bookInfo
    }
                
    if (bookRes.status != 200) {
        return bookInfo
    }
    
    if (bookRes.data.totalItems == 0) {
        return bookInfo
    }

    const book = bookRes.data.items[0].volumeInfo

    bookInfo = { 
        status: 1,
        title: book.title,
        authors: book.authors ?? [],
        publisher: book.publisher,
        categories: book.categories ?? [],
        coverSrc: book.imageLinks?.thumbnail ?? book.imageLinks?.smallThumbnail
    }
    
    return bookInfo 
}

export const addToUser = (book: any) => axios.post('/api/user/books/add', book)
export const removeFromUser = (book: any) => axios.post('/api/user/books/remove', book)

export const fetch = (params: any) => axios.get('/api/user/books', {
    params
})
export const fetchBorrowed = (params: any) => axios.get('/api/user/borrowed', {
    params
})

export const fetchUserBookInfo = (isbn: string) => axios.get(`/api/user/books/${isbn}`)