import type { NextPage, GetServerSideProps } from 'next'
import React from 'react'

import { verifyToken } from '../utils/utils'
import Scene from '../components/Scene/Scene'
import SignInOrUp from '../components/SignInOrUp/SignInOrUp'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;

  if (!verifyToken(req.cookies.token)) {
    return {
      props: {
        auth: false
      }
    }
  }
  
  return {
    props: {
      auth: true
    }
  }
}; 

const Home: NextPage = (props: any) => {  
  return (
    <Scene auth={props.auth}/>
  )
}

export default Home
