import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './redux/store'
import App from './App'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ErrorPage from './pages/error-page'
import { LazyImportComponent } from './pages/lazy-import-component'
import AboutEdit from './pages/AboutEdit'

const Home = React.lazy(() => import('./pages/Home'))
const Articles = React.lazy(() => import('./pages/Articles'))
const AddArticle = React.lazy(() => import('./pages/AddArticle'))
const Drafts = React.lazy(() => import('./pages/Drafts'))
const Says = React.lazy(() => import('./pages/Says'))
const Links = React.lazy(() => import('./pages/Links'))
const Msgs = React.lazy(() => import('./pages/Msgs'))
const Logs = React.lazy(() => import('./pages/Logs'))
const Shows = React.lazy(() => import('./pages/Shows'))
const About = React.lazy(() => import('./pages/About'))

const container = document.getElementById('root')
const root = createRoot(container)

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <LazyImportComponent lazyChildren={Home} />
      },
      {
        path: 'articles',
        element: <LazyImportComponent lazyChildren={Articles} />
      },
      {
        path: 'addArticle',
        element: <LazyImportComponent lazyChildren={AddArticle} />
      },
      {
        path: 'drafts',
        element: <LazyImportComponent lazyChildren={Drafts} />
      },
      {
        path: 'says',
        element: <LazyImportComponent lazyChildren={Says} />
      },
      {
        path: 'links',
        element: <LazyImportComponent lazyChildren={Links} />
      },
      {
        path: 'msgs',
        element: <LazyImportComponent lazyChildren={Msgs} />
      },
      {
        path: 'logs',
        element: <LazyImportComponent lazyChildren={Logs} />
      },
      {
        path: 'about',
        element: <LazyImportComponent lazyChildren={About} />
      },
      {
        path: 'aboutEdit',
        element: <LazyImportComponent lazyChildren={AboutEdit} />
      },
      {
        path: 'shows',
        element: <LazyImportComponent lazyChildren={Shows} />
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
