import { Route, Routes } from 'react-router-dom';
import AuthGuard from './guard/authguard';
import GuestGuard from './guard/guestguard'; // import guard
import Home from './pages/homes';
import Landing from './pages/landing/landing';
import Login from './pages/login';
import NotFound from './pages/not-found/not-found';
import Playground from './pages/playground';
import Register from './pages/register';
import Test from './pages/test';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route
                path="/login"
                element={
                    <GuestGuard>
                        <Login />
                    </GuestGuard>
                }
            />
            <Route
                path="/register"
                element={
                    <GuestGuard>
                        <Register />
                    </GuestGuard>
                }
            />

            <Route path="/test" element={<Test />} />

            <Route path="/play" element={<Playground />} />

            {/* Protected Route */}
            <Route
                path="/home"
                element={
                    <AuthGuard>
                        <Home />
                    </AuthGuard>
                }
            />

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
