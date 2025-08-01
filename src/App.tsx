import { Provider } from 'react-redux';
import './App.css';
import Router from './routes/router';
import { store } from './store';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './containers/auth';
import ScrollToTop from './Components/ScrollToTop';
import { WebSocketProvider } from './containers/WebSocketProvider';
import { WEBSOCKET_URL } from './config/api';

function App() {
  return(
    <>
      <BrowserRouter>
        <Provider store={store}>
          <AuthProvider>
            <WebSocketProvider serverUrl={WEBSOCKET_URL}>
              <ScrollToTop />
              <Router></Router>
            </WebSocketProvider>
          </AuthProvider>
        </Provider>
      </BrowserRouter>

    </>
  );
  

}


export default App;


