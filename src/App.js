import './libs/axios';
import { Route, Routes } from 'react-router-dom';
import Header from './layouts/Header';
import AuthorizeRouter from './router/AuthorizeRouter';
import Home from './pages/Home';
import Settings from './pages/Settings';

function App() {
    return (
        <Header>
            <Routes>
                <Route path='/' element={<AuthorizeRouter />}>
                    <Route index element={<Home />} />
                    <Route path='secret-keys' element={<Home />} />
                    <Route path='cards' element={<Home />} />
                    <Route path='marketplace' element={<Home />} />
                    <Route path='history' element={<Home />} />
                    <Route path='messeges' element={<Home />} />
                    <Route path='settings' element={<Settings />} />
                </Route>
            </Routes>
        </Header>
    );
}

export default App;
