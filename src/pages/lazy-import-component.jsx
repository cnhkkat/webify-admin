import React, { LazyExoticComponent } from 'react'

export const LazyImportComponent = (props: { lazyChildren: LazyExoticComponent }) => {
  return (
    <React.Suspense fallback={<div className='w-400 h-300 m-auto fs-36 mt-30'>正在加载中...</div>}>
      <props.lazyChildren />
    </React.Suspense>
  )
}
