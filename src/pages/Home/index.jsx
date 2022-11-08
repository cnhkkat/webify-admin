import React from 'react'
import Statistic from '../../components/Statistic'
import Welcome from '../../components/Welcome'
import Chart from '../../components/Chart'
import Class from '../../components/Class'
import Tag from '../../components/Tag'

import './index.css'

const Home = () => (
  <div className='contain'>
    <Welcome />
    <div className='flexBox'>
      <Statistic type={'articles'} />
      <Statistic type={'drafts'} />
      <Statistic type={'links'} />
      <Statistic type={'msgs'} />
      <Statistic type={'says'} />
    </div>
    <div className='flexBox'>
      <Chart />
      <Class />
      <Tag />
    </div>
  </div>
)
export default Home
