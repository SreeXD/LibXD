import React, { useState, useRef } from 'react'
import { ThemeProvider } from 'styled-components'
import PropagateLoader from 'react-spinners/PropagateLoader'

import * as studentsApi from '../../api/students'
import * as S from './AddStudentStyles'
import { TextInput, TextInputInner, TextBox, Label, ErrorMessage, SubmitContainer, Submit, SubmitSpan } from '../SignInOrUp/SignInOrUpStyles'
import { LoadingContainer, StatusMessage } from '../AddOrRemoveBook/AddOrRemoveBookStyles'

const AddStudent = (props: any) => {
    const [ student, setStudent ] = useState<any>({ admNo: 0, name: '', branch: '', batch: '', phone: '' })
    const [ errorMessages, setErrorMessages ] = useState<any>({ admNo: '', name: '', branch: '', batch: '', phone: '' })
    const [ statusMessage, setStatusMessage ] = useState<any>({ msg: '', color: '' })
    const [ submitting, setSubmitting ] = useState<boolean>(false)
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
                    submit(null)
                }
            }
        }
    }
    
    const toggleFocus = (e: any) => {
        const par = e.target.parentNode;
        const label = par.getElementsByTagName('label')[0]
        label.classList.toggle('focus')   
    }

    const onAdmnoInputFocus = (e: any) => {
        if (e) {
            toggleFocus(e)
        }

        errorsRef.current = { ...errorsRef.current, admNo: '' } 
        setErrorMessages(errorsRef.current)
    }

    const onAdmnoInputBlur = async (e: any) => {
        if (e) {
            toggleFocus(e)
        }

        if (!e.target.value || +e.target.value < 0) {
            errorsRef.current = { ...errorsRef.current, admNo: 'invalid admission number' } 
            return setErrorMessages(errorsRef.current)
        }

        try {
            await studentsApi.fetchInfo(student.admNo)
            errorsRef.current = { ...errorsRef.current, admNo: `student with admission number ${student.admNo} already exists` } 
            return setErrorMessages(errorsRef.current)
        }

        catch (error) { }
    }

    const onNameInputFocus = (e: any) => {
        if (e) {
            toggleFocus(e)
        }

        errorsRef.current = { ...errorsRef.current, name: '' } 
        setErrorMessages(errorsRef.current)
    }

    const onNameInputBlur = (e: any) => {
        if (e) {
            e.target.value = student.name
            toggleFocus(e)
        }

        if (student.name == '') {
            errorsRef.current = { ...errorsRef.current, name: 'student name cannot be empty' } 
            return setErrorMessages(errorsRef.current)
        }

        if (student.name.match(/[0-9]|[!@#$%^&*()<>?,./]/)) {
            errorsRef.current = { ...errorsRef.current, name: 'student name cannot contain numbers or special characters' } 
            return setErrorMessages(errorsRef.current)
        }
    }

    const onBranchInputFocus = (e: any) => {
        if (e) {
            toggleFocus(e)
        }

        errorsRef.current = { ...errorsRef.current, branch: '' } 
        setErrorMessages(errorsRef.current)
    }

    const onBranchInputBlur = (e: any) => {
        if (e) {
            e.target.value = student.branch
            toggleFocus(e)
        }

        if (student.branch == '') {
            errorsRef.current = { ...errorsRef.current, branch: 'branch cannot be empty' } 
            return setErrorMessages(errorsRef.current)
        }
    }

    const onBatchInputFocus = (e: any) => {
        if (e) {
            toggleFocus(e)
        }

        errorsRef.current = { ...errorsRef.current, batch:  '' } 
        setErrorMessages(errorsRef.current)
    }

    const onBatchInputBlur = (e: any) => {
        if (e) {
            e.target.value = student.batch
            toggleFocus(e)
        }

        if (student.batch == '') {
            errorsRef.current = { ...errorsRef.current, batch: 'batch cannot be empty' } 
            return setErrorMessages(errorsRef.current)
        }
    }

    const onPhoneInputFocus = (e: any) => {
        if (e) {
            toggleFocus(e)
        }

        errorsRef.current = { ...errorsRef.current, phone: '' } 
        setErrorMessages(errorsRef.current)
    }

    const onPhoneInputBlur = (e: any) => {
        if (e) {
            toggleFocus(e)
        }

        if (!student.phone) {
            errorsRef.current = { ...errorsRef.current, phone: 'invalid phone number' } 
            return setErrorMessages(errorsRef.current)
        }
    }

    const submit = async (e: any) => {
        if (submitting) {
            return
        }

        setSubmitting(true)

        let fail = 0

        if (!student.admNo || student.admNo < 0) {
            fail = 1
            errorsRef.current = { ...errorsRef.current, admNo: 'invalid admission number' } 
        }

        if (student.name == '') {
            fail = 1
            errorsRef.current = { ...errorsRef.current, name: 'student name cannot be empty' } 
        }

        if (student.name.match(/[0-9]|[!@#$%^&*()<>?,./]/)) {
            fail = 1
            errorsRef.current = { ...errorsRef.current, name: 'student name cannot contain numbers or special characters' } 
        }
        
        if (student.branch == '') {
            fail = 1
            errorsRef.current = { ...errorsRef.current, branch: 'branch cannot be empty' } 
        }
        
        if (student.batch == '') {
            fail = 1
            errorsRef.current = { ...errorsRef.current, batch: 'batch cannot be empty' } 
        }

        if (fail) {
            setSubmitting(false)
            return setErrorMessages(errorsRef.current)
        }

        try {
            var res = await studentsApi.createOne(student)
        }
        catch (error: any) {
            setSubmitting(false)
            return setStatusMessage({ msg: error.response.data.message ?? 'unknown error occured', color: '#fd9595' })  
        }

        if (res.status != 200) {
            setSubmitting(false)
            return setStatusMessage({ msg: res.data.message ?? 'unknown error occured', color: '#fd9595' })            
        }

        setSubmitting(false)
        setStatusMessage({ msg: `student admission number ${student.admNo} has been added`, color: '#61c77c' })
        props.refresh()
    }

    return (
        <ThemeProvider theme={{ mode: 1, primary: '#828ffa' }}>
            <S.AddStudent>
                <S.CloseButton onClick={props.close}>
                    <S.CloseSpan />
                    <S.CloseSpan />
                </S.CloseButton>

                <S.Title>Student</S.Title>

                <TextInput>
                    <TextInputInner>
                        <Label textLength={6}>Admission number</Label>
                        <TextBox data-index='1' onKeyDown={onKeyDown} error={errorMessages.admNo != ''} type='number' onChange={e => setStudent({ ...student, admNo: +e.target.value })} onFocus={onAdmnoInputFocus} onBlur={onAdmnoInputBlur} />
                    </TextInputInner>
                    <ErrorMessage>{errorMessages.admNo}</ErrorMessage>
                </TextInput>

                <TextInput>
                    <TextInputInner>
                        <Label textLength={5}>Student name</Label>
                        <TextBox data-index='2' onKeyDown={onKeyDown} error={errorMessages.name != ''} onChange={e => setStudent({ ...student, name: e.target.value.trim() })} onFocus={onNameInputFocus} onBlur={onNameInputBlur} />
                    </TextInputInner>
                    <ErrorMessage>{errorMessages.name}</ErrorMessage>
                </TextInput>

                <TextInput half={true}>
                    <TextInputInner half={true}>
                        <div>
                            <Label textLength={3}>Branch</Label>
                        </div>

                        <TextBox data-index='3' onKeyDown={onKeyDown} error={errorMessages.branch != ''} onChange={e => setStudent({ ...student, branch: e.target.value.trim() })} onFocus={onBranchInputFocus} onBlur={onBranchInputBlur} />
                        <ErrorMessage>{errorMessages.branch}</ErrorMessage>
                    </TextInputInner>

                    <TextInputInner half={true}>
                        <div>
                            <Label textLength={3}>Batch</Label>
                        </div>

                        <TextBox data-index='4' onKeyDown={onKeyDown} error={errorMessages.batch != ''} onChange={e => setStudent({ ...student, batch: e.target.value.trim() })} onFocus={onBatchInputFocus} onBlur={onBatchInputBlur} />
                        <ErrorMessage>{errorMessages.batch}</ErrorMessage>
                    </TextInputInner>
                </TextInput>

                <TextInput>
                    <TextInputInner>
                        <Label textLength={5}>Contact number</Label>
                        <TextBox type='number' data-index='5' onKeyDown={onKeyDown} error={errorMessages.phone != ''} onChange={e => setStudent({ ...student, phone: e.target.value })} onFocus={onPhoneInputFocus} onBlur={onPhoneInputBlur} />
                    </TextInputInner>
                    <ErrorMessage>{errorMessages.phone}</ErrorMessage>
                </TextInput>

                { !submitting 
                    ? <StatusMessage color={statusMessage.color}>{statusMessage.msg}</StatusMessage>
                    : 
                    <LoadingContainer>
                        <PropagateLoader color={'#616161'} size={7} />
                    </LoadingContainer>
                }

                <SubmitContainer>
                    <Submit disabled={disabled()} onClick={submit}>
                        <SubmitSpan />
                        <SubmitSpan />
                    </Submit>
                </SubmitContainer>
            </S.AddStudent>
        </ThemeProvider>
    )
}

export default AddStudent