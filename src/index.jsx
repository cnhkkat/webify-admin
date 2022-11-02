import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './redux/store'
import App from './App'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ErrorPage from './pages/error-page'

const container = document.getElementById('root')
const root = createRoot(container)

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />
  }
])

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
)
