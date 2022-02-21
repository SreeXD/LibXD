import React, { useEffect, useRef, useState } from 'react'
import HashLoader from 'react-spinners/HashLoader'

import * as studentsApi from '../../api/students'
import * as S from './StudentInfoStyles'
import * as GS from '../General/Styles'
import { CloseButton, CloseSpan } from '../AddStudent/AddStudentStyles'
import List from '../List/List'
import { displayLocalDate, dateWithoutTime } from '../../utils/utils'

const StudentInfo = (props: any) => {
    const studentInfo = props.studentInfo 
    const setShowStudentInfo = props.setShowStudentInfo 
    const [control, setControl] = useState<any>({ leftActive: false, rightActive: false })
    const [range, setRange] = useState<any>({ start: 0, end: 0 })
    const [borrowed, setBorrowed] = useState<any[]>([])
    const [borrowLoading, setBorrowLoading] = useState<boolean>(true)
    const [listLoading, setListLoading] = useState<boolean>(true)
    const todayRef = useRef<Date>(new Date())
    const limit = 31

    const fetchBorrowed = async (query?: any) => {
        setBorrowLoading(true)

        try {
            var res = await studentsApi.fetchBorrowed(studentInfo.admNo, { 
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
        
        setBorrowLoading(false)
        setListLoading(false)
    }

    useEffect(() => {
        fetchBorrowed()
    }, [])

    useEffect(() => {
        todayRef.current = new Date()
    })

    return (
        <S.StudentInfo>
            <CloseButton className='student-info-button' onClick={() => setShowStudentInfo(false)}>
                <CloseSpan />
                <CloseSpan />
            </CloseButton>

            <S.StudentInfoUpper>
                <S.StudentInfoHead>
                    <S.StudentTitle>Student</S.StudentTitle>
                    <S.StudentSubtitle>{studentInfo.admNo}</S.StudentSubtitle>
                </S.StudentInfoHead>

                <S.StudentGrid>
                    <S.StudentGridCell>
                        <S.StudentGridCellHead>Name</S.StudentGridCellHead>

                        <S.StudentGridCellValue>{studentInfo.name}</S.StudentGridCellValue>
                    </S.StudentGridCell>

                    <S.StudentGridCell>
                        <S.StudentGridCellHead>Branch</S.StudentGridCellHead>

                        <S.StudentGridCellValue>{studentInfo.branch}</S.StudentGridCellValue>
                    </S.StudentGridCell>

                    <S.StudentGridCell>
                        <S.StudentGridCellHead>Batch</S.StudentGridCellHead>

                        <S.StudentGridCellValue>{studentInfo.batch}</S.StudentGridCellValue>
                    </S.StudentGridCell>

                    <S.StudentGridCell>
                        <S.StudentGridCellHead>Contact number</S.StudentGridCellHead>

                        <S.StudentGridCellValue>{studentInfo.phone}</S.StudentGridCellValue>
                    </S.StudentGridCell>
                </S.StudentGrid>
            </S.StudentInfoUpper>

            { listLoading && 
                <S.BorrowLoading>
                    <HashLoader size={20} />
                </S.BorrowLoading>
            }

            { !listLoading && borrowed.length > 0 &&
                <List 
                    title={`Lent books`} 
                    style={{ margin: '50px 0 0 0' }}
                    controlRight = {() => fetchBorrowed({ afterDate: borrowed[borrowed.length - 1].dueDate, afterId: borrowed[borrowed.length - 1].id })}
                    controlRightActive = {control.rightActive}
                    controlLeft = {() => fetchBorrowed({ beforeDate: borrowed[0].dueDate, beforeId: borrowed[0].id })}
                    controlLeftActive = {control.leftActive}
                    range={range}
                    notWindow={true}>

                    { borrowLoading && 
                        <S.BorrowLoading>
                            <HashLoader size={20} />
                        </S.BorrowLoading>
                    }

                    <GS.TableContainer>
                        <GS.Table>
                        { !borrowLoading && 
                            <tbody>
                                <GS.TableRow>
                                    <GS.TableHeader>Isbn</GS.TableHeader>
                                    <GS.TableHeader>Title</GS.TableHeader>
                                    <GS.TableHeader>Borrow date</GS.TableHeader>
                                    <GS.TableHeader>Due date</GS.TableHeader>
                                </GS.TableRow>

                                {borrowed.map((b, i) => {
                                    b.borrowDate = new Date(b.borrowDate)
                                    b.dueDate = new Date(b.dueDate)

                                    return (
                                        <GS.TableRow key={i} className={dateWithoutTime(b.dueDate) < dateWithoutTime(todayRef.current) ? 'overdue' : ''}>
                                            <GS.TableData>{b.isbn}</GS.TableData>
                                            <GS.TableData>{b.title}</GS.TableData>
                                            <GS.TableData>{displayLocalDate(b.borrowDate)}</GS.TableData>
                                            <GS.TableData>{displayLocalDate(b.dueDate)}</GS.TableData>
                                        </GS.TableRow>
                                    )
                                })}
                            </tbody>
                        }
                        </GS.Table>
                    </GS.TableContainer>
                </List>
            }
        </S.StudentInfo>
    )
}

export default StudentInfo