import React from 'react'
import Statistic from '../../components/Statistic'
import Welcome from '../../components/Welcome'
import Chart from '../../components/Chart'
import Class from '../../components/Class'
import Tag from '../../components/Tag'
const Home = () => (
  <div className='ml-100'>
    <Welcome />
    <div className='justify-around'>
      <Statistic type={'articles'} />
      <Statistic type={'drafts'} />
      <Statistic type={'says'} />
      <Statistic type={'links'} />
      <Statistic type={'msgs'} />
    </div>
    <div className='justify-around mt-10'>
      <Chart />
      <Class />
      <Tag />
    </div>
  </div>
)
export default Home
