import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/Router.tsx'
import { store } from './app/store.ts'
import { Provider } from 'react-redux'
import { SignalRProvider } from './app/SignalRProvider.ts'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
      <RouterProvider router={router} />
      <SignalRProvider />
  </Provider>
)
