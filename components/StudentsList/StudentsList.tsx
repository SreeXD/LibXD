import React, { useEffect, useState } from 'react'
import HashLoader from 'react-spinners/HashLoader'

import * as studentsApi from '../../api/students'
import AddStudent from '../AddStudent/AddStudent'
import * as S from './StudentsListStyles'
import * as GS from '../General/Styles'
import StudentInfo from '../StudentInfo/StudentInfo'
import List from '../List/List'

const StudentsList = (props: any) => {
    const [loading, setLoading] = useState<boolean>(true)
    const [addStudent, setAddStudent] = useState<boolean>(false)
    let [studentInfo, setStudentInfo] = useState<any>({ admNo: 0, name: '', branch: '', batch: '', phone: '', borrowed: [] as any[] })
    const [showStudentInfo, setShowStudentInfo] = useState<boolean>(false)
    const [studentInfoLoading, setStudentInfoLoading] = useState<boolean>(false)
    const [students, setStudents] = useState<any[]>([])
    const [control, setControl] = useState<any>({ leftActive: false, rightActive: false })
    const [range, setRange] = useState<any>({ start: 0, end: 0 })
    const [search, setSearch] = useState<string>("")
    const limit = 31

    const searchHandler = async (search: string) => {
        setSearch(search)
        fetchStudents({ search })
    }

    const fetchStudents = async (query?: any) => {
        setLoading(true)

        try {
            var res = await studentsApi.fetch({ 
                limit,
                ...query
            })
        }
        
        catch (error) {
            fetchStudents(query)
            return 
        }

        const resStudents = res.data.students

        if (query?.after) {
            setRange({ start: range.start + limit - 1, end: range.end + Math.min(limit - 1, resStudents.length) })
            setControl({ leftActive: true, rightActive: resStudents.length == limit })
            setStudents(resStudents.slice(0, limit - (resStudents.length == limit ? 1 : 0)))
        }

        else if (query?.before) {
            setRange({ start: range.start - Math.min(limit - 1, resStudents.length), end: range.start - 1 })
            setControl({ leftActive: resStudents.length == limit, rightActive: true })
            setStudents(resStudents.slice((resStudents.length == limit ? 1 : 0), limit))
        }

        else {
            setRange({ start: Math.min(resStudents.length, 1), end: Math.min(limit - 1, resStudents.length) })
            setControl({ leftActive: false, rightActive: resStudents.length == limit })
            setStudents(resStudents.slice(0, limit - (resStudents.length == limit ? 1 : 0)))
        }
        
        setLoading(false)  
    }

    useEffect(() => {
        fetchStudents()
    }, [])

    const onRowClick = async (e: any) => {
        setStudentInfoLoading(true)
        setShowStudentInfo(true)
        
        const admno = +e.target.parentNode.getAttribute('data-admno')
        const res = await studentsApi.fetchInfo(admno)
        const studentData = res.data 
        
        studentInfo = { ...studentInfo, ...studentData }
        
        setStudentInfo(studentInfo)
        setStudentInfoLoading(false)
    }

    return (
        <List title="Students"
            primary="#7585f0" 
            controlRight = {() => fetchStudents({ search, after: students[students.length - 1].admNo })}
            controlRightActive = {control.rightActive}
            controlLeft = {() => fetchStudents({ search, before: students[0].admNo })}
            controlLeftActive = {control.leftActive}
            searchHandler = {searchHandler}
            controlAdd={() => setAddStudent(true)} 
            range={range}
            close={props.close}>
                
            { showStudentInfo && 
                <S.StudentInfoContainer>
                    <GS.Bg onClick={() => setShowStudentInfo(false)} />
                    { studentInfoLoading &&
                        <GS.LoadingContainer>
                            <HashLoader size={24} />
                        </GS.LoadingContainer>
                    }

                    { !studentInfoLoading &&
                        <StudentInfo studentInfo={studentInfo} setShowStudentInfo={setShowStudentInfo} />
                    }
                </S.StudentInfoContainer>
            }

            {addStudent &&
                <S.AddStudentContainer>
                    <GS.Bg onClick={() => setAddStudent(false)} />
                    <AddStudent close={() => setAddStudent(false)} refresh={() => {
                        setControl({ leftActive: false, rightActive: false })
                        fetchStudents({ search })
                    }} />
                </S.AddStudentContainer>
            }

            {loading &&
                <S.LoadingContainer>
                    <HashLoader size={22} color='#212121' />
                </S.LoadingContainer>
            }

            { !loading && 
                <GS.TableContainer>
                    <GS.Table>
                        <tbody>
                            <GS.TableRow>
                                <GS.TableHeader>Adm no</GS.TableHeader>
                                <GS.TableHeader>Name</GS.TableHeader>
                                <GS.TableHeader>Branch</GS.TableHeader>
                                <GS.TableHeader>Batch</GS.TableHeader>
                            </GS.TableRow>

                            {students.map((s, i) => (
                                <GS.TableRow key={i} data-admno={s.admNo} onClick={onRowClick}>
                                    <GS.TableData>{s.admNo}</GS.TableData>
                                    <GS.TableData>{s.name}</GS.TableData>
                                    <GS.TableData>{s.branch}</GS.TableData>
                                    <GS.TableData>{s.batch}</GS.TableData>
                                </GS.TableRow>
                            ))}
                        </tbody>
                    </GS.Table>
                </GS.TableContainer>
            }            
        </List>
    )
}

export default StudentsList