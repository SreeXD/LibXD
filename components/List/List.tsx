import react, { useState } from 'react'
import { ThemeProvider } from 'styled-components'

import * as S from './ListStyles'

const List = (props: any) => {
    const [searching, setSearching] = useState<boolean>(false)
    const [searchValue, setSearchValue] = useState<string>("")

    const onSearchClick = () => {
        const searchBar: any = document.querySelector(S.SearchBar)

        if (!searching) {
            searchBar.focus()
        }
        
        else {
            searchBar.blur()
        }

        setSearching(!searching)
    }

    const onSearchBarKeyPress = (e: any) => {
        if (e.key == 'Enter') {
            setSearching(false)

            e.target.blur()
        }
    }

    const onSearchBarBlur = (e: any) => {
        setSearchValue(e.target.value)
        props.searchHandler(e.target.value)

        setSearching(false)
    }

    return (
        <ThemeProvider theme={{ primary: props.primary, secondary: props.secondary }}>
            <S.List {...props}>
                <S.ListHeader>
                    <S.HeaderLeft>
                        <S.ListTitle>{props.title}</S.ListTitle>

                        {searchValue != "" &&
                            <S.ListSubtitle>searching {`"${searchValue}"`}</S.ListSubtitle>
                        }
                    </S.HeaderLeft>

                    <S.ListControls>
                        {props.range && 
                            <S.DisplayRange>
                                {props.range.start} - {props.range.end}
                            </S.DisplayRange>
                        }

                        {props.controlLeft && 
                            <S.ControlLeft activated={props.controlLeftActive} onClick={props.controlLeftActive ? props.controlLeft : null }>
                                <S.Span />
                                <S.Span />
                            </S.ControlLeft>
                        }

                        {props.controlRight && 
                            <S.ControlRight activated={props.controlRightActive} onClick={props.controlRightActive ? props.controlRight : null }>
                                <S.Span />
                                <S.Span />
                            </S.ControlRight>
                        }

                        {props.searchHandler &&
                            <>
                                <S.Search activated={searching} onClick={onSearchClick}>
                                    <S.Span />
                                    <S.Span />
                                </S.Search>

                                <S.SearchBar activated={searching} onKeyPress={onSearchBarKeyPress} onBlur={onSearchBarBlur}>

                                </S.SearchBar>
                            </>
                        }

                        {props.close &&
                            <S.Close onClick={props.close}>
                                <S.Span />
                                <S.Span />
                            </S.Close>
                        }
                    </S.ListControls>
                </S.ListHeader>

                {props.children}

                { (props.controlAdd || props.controlRemove) && 
                    <S.ListFooter>
                        <S.FooterControls>
                            {props.controlAdd &&
                                <S.ControlAdd onClick={props.controlAdd}>
                                    <S.Span />
                                    <S.Span />
                                </S.ControlAdd>
                            }

                            {props.controlRemove && 
                                <S.ControlRemove onClick={props.controlRemove}>
                                    <S.Span />
                                </S.ControlRemove>
                            }
                        </S.FooterControls>
                    </S.ListFooter>
                }
            </S.List>
        </ThemeProvider>
    )
}

export default List 