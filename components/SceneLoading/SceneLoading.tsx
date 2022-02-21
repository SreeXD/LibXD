import React from 'react'
import HashLoader from 'react-spinners/HashLoader'

import * as S from './SceneLoadingStyles'

const SceneLoading = (props: any) => {
    return (
        <S.SceneLoading>
            <S.SceneLoadingInner>
                <HashLoader size={34} color={'#4868f7'} />

                <S.LoadingText>{props.loadingText}</S.LoadingText>
            </S.SceneLoadingInner>
        </S.SceneLoading>
    )
}

export default SceneLoading