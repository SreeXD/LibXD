import React, { useState, useRef } from 'react'
import { ThemeProvider } from 'styled-components'
import PropagateLoader from 'react-spinners/PropagateLoader'

import store from '../../redux/store'
import { useAppDispatch } from '../../redux/hooks'
import { signInUser, signUpUser } from '../../redux/features/userSlice'
import * as S from './SignInOrUpStyles'
import { LoadingContainer } from '../AddOrRemoveBook/AddOrRemoveBookStyles'

const SignInOrUp = (props: any) => {
    const dispatch = useAppDispatch()

    let [mode, setMode] = useState<any>(0)
    let [submitting, setSubmitting] = useState<boolean>(false)
    const [ credentials, setCredentials ] = useState<any>({ username: '',  password: '', firstName: '',  lastName: '',  email: '' })
    const [ errorMessages, setErrorMessages ] = useState<any>({ username: '',  password: '', firstName: '',  lastName: '',  email: '' })
    const errorsRef = useRef(errorMessages)

    const disabled = () => {
        return Object.keys(errorMessages).slice(0, (!mode ? 2 : 5)).some(e => errorMessages[e] != '')
    }

    const onKeyDown = async (e: any) => {
        if (e.key == 'Enter') {
            const index = +e.target.getAttribute('data-index')
            const next: any = document.querySelector(`[data-index="${index+1}"]`)

            e.target.blur(e)
            
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
    
    const toggleFocus = (e: any) => {
        const par = e.target.parentNode;
        const label = par.getElementsByTagName('label')[0]
        label.classList.toggle('focus')
    }

    const onUsernameInputFocus = async(e: any) => {
        if (e) {
            toggleFocus(e);
        }

        errorsRef.current = { ...errorsRef.current, username: '' } 
        setErrorMessages(errorsRef.current)
    }

    const onUsernameInputBlur = async (e: any) => {
        if (e) {
            e.target.value = credentials.username
            toggleFocus(e);
        }

        if (credentials.username == '') {
            errorsRef.current = { ...errorsRef.current, username: 'username cannot be empty' } 
            return setErrorMessages(errorsRef.current)
        }

        if (credentials.username.indexOf(' ') != -1) {
            errorsRef.current = { ...errorsRef.current, username: 'username contains spaces' } 
            return setErrorMessages(errorsRef.current)
        }

        const res = await fetch(`/api/user/exists/id/${credentials.username}`)

        if (!mode) {
            if (res.status != 200) {
                errorsRef.current = { ...errorsRef.current, username: `user ${credentials.username} does not exist` } 
                setErrorMessages(errorsRef.current)
            }
        }

        else {
            if (res.status == 200) {
                errorsRef.current = { ...errorsRef.current, username: `username ${credentials.username} is already taken` } 
                setErrorMessages(errorsRef.current)
            }
        }
    }

    const onEmailInputFocus = async(e: any) => {
        if (e) {
            toggleFocus(e);
        }

        errorsRef.current = { ...errorsRef.current, email: '' } 
        setErrorMessages(errorsRef.current)
    }

    const onEmailInputBlur = async (e: any) => {
        if (e) {
            e.target.value = credentials.email
            toggleFocus(e);
        }

        if (credentials.email == '') {
            errorsRef.current = { ...errorsRef.current, email: 'email address cannot be empty' } 
            return setErrorMessages(errorsRef.current)
        }

        if (credentials.email.indexOf(' ') != -1) {
            errorsRef.current = { ...errorsRef.current, email: 'email address contains spaces' } 
            return setErrorMessages(errorsRef.current)
        }

        const parts: string[] = credentials.email.split(/\.|@/)
        
        if (parts.length < 3 || parts.some(p => p == '')) {
            errorsRef.current = { ...errorsRef.current, email: 'invalid email address' } 
            return setErrorMessages(errorsRef.current)
        }

        if (mode) {
            const res = await fetch(encodeURI(`/api/user/exists/email/${credentials.email}`))

            if (res.status == 200) {
                errorsRef.current = { ...errorsRef.current, email: 'user with this email address already exists' } 
                setErrorMessages(errorsRef.current)
            }
        }
    }

    const onFirstNameInputFocus = (e: any) => {
        if (e) {
            toggleFocus(e);
        }

        errorsRef.current = { ...errorsRef.current, firstName: '' } 
        setErrorMessages(errorsRef.current)
    } 

    const onFirstNameInputBlur = (e: any) => {
        if (e) {
            e.target.value = credentials.firstName
            toggleFocus(e);
        }

        if (credentials.firstName == '') {
            errorsRef.current = { ...errorsRef.current, firstName: 'first name cannot be empty' } 
            return setErrorMessages(errorsRef.current)
        }

        if (credentials.firstName.indexOf(' ') != -1) {
            errorsRef.current = { ...errorsRef.current, firstName: 'first name contains spaces' } 
            return setErrorMessages(errorsRef.current)
        }
    }

    const onLastNameInputFocus = (e: any) => {
        if (e) {
            toggleFocus(e);
        }

        errorsRef.current = { ...errorsRef.current, lastName: '' } 
        setErrorMessages(errorsRef.current)
    } 

    const onLastNameInputBlur = (e: any) => {
        if (e) {
            e.target.value = credentials.lastName
            toggleFocus(e);
        }

        if (credentials.lastName == '') {
            errorsRef.current = { ...errorsRef.current, lastName: 'last name cannot be empty' } 
            return setErrorMessages(errorsRef.current)
        }

        if (credentials.lastName.indexOf(' ') != -1) {
            errorsRef.current = { ...errorsRef.current, lastName: 'last name contains spaces' } 
            return setErrorMessages(errorsRef.current)
        }
    }

    const onPasswordInputFocus = (e: any) => {
        if (e) {
            toggleFocus(e);
        }

        errorsRef.current = { ...errorsRef.current, password: '' } 
        setErrorMessages(errorsRef.current)
    }

    const onPasswordInputBlur = (e: any) => {
        if (e) {
            e.target.value = credentials.password
            toggleFocus(e);
        }

        if (credentials.password == '') {
            errorsRef.current = { ...errorsRef.current, password: 'password cannot be empty' } 
            return setErrorMessages(errorsRef.current)
        }

        if (credentials.password.indexOf(' ') != -1) {
            errorsRef.current = { ...errorsRef.current, password: 'password contains spaces' } 
            return setErrorMessages(errorsRef.current)
        }

        if (credentials.password.length < 6) {
            errorsRef.current = { ...errorsRef.current, password: 'password should be at least 6 characters long' } 
            return setErrorMessages(errorsRef.current)
        }
    }

    const toggleMode = async () => {
        mode = ++mode % 2
        setMode(mode)

        if (credentials.username) {
            errorsRef.current = { ...errorsRef.current, username: '' } 
            setErrorMessages(errorsRef.current)
            onUsernameInputBlur(null)
        }
    }

    const submit = async () => {
        setSubmitting(true)
        let fail = 0

        if (credentials.username == '') {
            fail = 1
            errorMessages.username = 'username cannot be empty'
        }
        
        if (credentials.password == '') {
            fail = 1
            errorMessages.password = 'password cannot be empty'
        }

        if (credentials.password.length < 6) {
            fail = 1
            errorMessages.password = 'password should be at least 6 characters long'
        }

        if (mode) {
            if (credentials.firstName == '') {
                fail = 1
                errorMessages.firstName = 'first name cannot be empty'
            }

            if (credentials.lastName == '') {
                fail = 1
                errorMessages.lastName = 'last name cannot be empty'
            }

            if (credentials.email == '') {
                fail = 1
                errorMessages.email = 'email address cannot be empty'
            }
        }

        if (fail) {
            setSubmitting(false)
            errorsRef.current = { ...errorsRef.current }
            return setErrorMessages(errorsRef.current)
        }

        const params: any = {
            userId: credentials.username,
            password: credentials.password
        }

        if (mode) {
            params.name = credentials.firstName + ' ' + credentials.lastName
            params.email = credentials.email
        }

        if (!mode) {
            await dispatch(signInUser(params))
        }

        else {
            await dispatch(signUpUser(params))
        }

        const user = store.getState().user;

        if (!mode) {
            if (user.status == 'failed') {
                setSubmitting(false)
                errorsRef.current = { ...errorsRef.current, password: user.errorMessage ?? 'unknown error occured' } 
                return setErrorMessages(errorsRef.current)
            }
    
            else {
                props.onSignIn()
            }
        }

        else {
            if (user.status == 'success') {
                const inputs = document.getElementsByTagName('input');

                for (let i = 0; i < inputs.length; ++i) {
                    const input = inputs.item(i)

                    if (!input) break

                    if (input.name != 'username') {
                        input.value = ''
                    }
                }

                setCredentials({ username: credentials.username, password: '' })
                setMode(++mode % 2)
            }

            else {
                setSubmitting(false)
                errorsRef.current = { ...errorsRef.current, password: user.errorMessage ?? 'unknown error occured' } 
                return setErrorMessages(errorsRef.current)
            }
        }

        setSubmitting(false)
    }

    return (
        <ThemeProvider theme={{mode, primary: '#B58FF3', secondary: '#86c3fb' }}>
            <S.SignInOrUp>
                <S.Title>Sign</S.Title>

                <S.Form>
                    <S.TextInput>
                        <S.TextInputInner>
                            <S.Label textLength={4}>username</S.Label>
                            <S.TextBox onKeyDown={onKeyDown} data-index='1' name="username" error={errorMessages.username != ''} onChange={(e) => setCredentials({...credentials, username: e.target.value.trim() })} onFocus={onUsernameInputFocus} onBlur={onUsernameInputBlur} />
                        </S.TextInputInner>
                        <S.ErrorMessage>{errorMessages.username}</S.ErrorMessage>
                    </S.TextInput>

                    <S.SignUpInputs>
                        <S.TextInput half={true}>
                            <S.TextInputInner half={true}>
                                <div>
                                    <S.Label textLength={4}>first name</S.Label>
                                </div>
                                <S.TextBox onKeyDown={onKeyDown} data-index={2 * mode} error={errorMessages.firstName != ''} onChange={(e) => setCredentials({...credentials, firstName: e.target.value.trim() })} onFocus={onFirstNameInputFocus} onBlur={onFirstNameInputBlur} />
                                <S.ErrorMessage>{errorMessages.firstName}</S.ErrorMessage>
                            </S.TextInputInner>

                            <S.TextInputInner half={true}>
                                <div>
                                    <S.Label textLength={4}>last name</S.Label>
                                </div>
                                <S.TextBox onKeyDown={onKeyDown} data-index={3 * mode} error={errorMessages.lastName != ''} onChange={(e) => setCredentials({...credentials, lastName: e.target.value.trim() })} onFocus={onLastNameInputFocus} onBlur={onLastNameInputBlur} />
                                <S.ErrorMessage>{errorMessages.lastName}</S.ErrorMessage>
                            </S.TextInputInner>
                        </S.TextInput>

                        <S.TextInput>
                            <S.TextInputInner>
                                <S.Label textLength={5}>email address</S.Label>
                                <S.TextBox onKeyDown={onKeyDown} data-index={4 * mode} error={errorMessages.email != ''} onChange={(e) => setCredentials({...credentials, email: e.target.value.trim() })} onFocus={onEmailInputFocus} onBlur={onEmailInputBlur} />
                            </S.TextInputInner>
                            <S.ErrorMessage>{errorMessages.email}</S.ErrorMessage>
                        </S.TextInput>
                    </S.SignUpInputs>

                    <S.TextInput>
                        <S.TextInputInner>
                            <S.Label textLength={4}>password</S.Label>
                            <S.TextBox onKeyDown={onKeyDown} data-index={!mode ? '2' : '5'} error={errorMessages.password != ''} type="password" onChange={(e) => setCredentials({...credentials, password: e.target.value })} onFocus={onPasswordInputFocus} onBlur={onPasswordInputBlur} />
                        </S.TextInputInner>
                        <S.ErrorMessage>{errorMessages.password}</S.ErrorMessage>
                    </S.TextInput>
                </S.Form>

                {submitting && 
                    <LoadingContainer>
                        <PropagateLoader size='7' color='#484848' />
                    </LoadingContainer>
                }

                <S.SubmitContainer>
                    <S.Toggle onClick={() => toggleMode()}>{mode ? 'sign in instead' : 'sign up instead'}</S.Toggle>

                    <S.Submit onClick={submit} disabled={disabled()}>
                        <S.SubmitSpan />
                        <S.SubmitSpan />
                    </S.Submit>
                </S.SubmitContainer>
            </S.SignInOrUp>
        </ThemeProvider>
    )
}

export default SignInOrUp