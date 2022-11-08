import React, { LazyExoticComponent } from 'react'

export const LazyImportComponent = (props: { lazyChildren: LazyExoticComponent }) => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <props.lazyChildren />
    </React.Suspense>
  )
}
