import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ConfigProvider, theme, App as AntdApp } from 'antd'

createRoot(document.getElementById('root')!).render(
  <ConfigProvider
    theme={{
      algorithm: theme.darkAlgorithm,
    }}
  >
    <AntdApp>
      <App/>
    </AntdApp>
  </ConfigProvider>
)



