import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './redux/store'
import App from './App'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ErrorPage from './pages/error-page'
import { LazyImportComponent } from './pages/lazy-import-component'

const Home = React.lazy(() => import('./pages/Home'))
const Articles = React.lazy(() => import('./pages/Articles'))
const AddArticle = React.lazy(() => import('./pages/AddArticle'))

const container = document.getElementById('root')
const root = createRoot(container)

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <LazyImportComponent lazyChildren={Home} />
      },
      {
        path: 'articles',
        element: <LazyImportComponent lazyChildren={Articles} />
      },
      {
        path: 'addArticle',
        element: <LazyImportComponent lazyChildren={AddArticle} />
      }
    ]
  }
])

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
)
