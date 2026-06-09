import { useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LocaleProvider } from '@/contexts/LocaleProvider';
import { Toaster } from '@/components/ui/toaster';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import Layout from './components/Layout';
import Index from './pages/Index';
import Register from './pages/Register';
import Surveys from './pages/Surveys';
import SurveyResponse from './pages/SurveyResponse';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ResearcherDashboard from './pages/ResearcherDashboard';
import EncuestaRedirect from './pages/EncuestaRedirect';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import ResearcherRoute from './components/ResearcherRoute';

import '@solana/wallet-adapter-react-ui/styles.css';

const App = () => {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

    return (
        <LocaleProvider>
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/registro" element={<Register />} />
                            <Route path="/encuesta/:id" element={<EncuestaRedirect />} />
                            <Route
                                path="/encuestas"
                                element={
                                    <ProtectedRoute>
                                        <Surveys />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/encuestas/:id"
                                element={
                                    <ProtectedRoute>
                                        <SurveyResponse />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/perfil"
                                element={
                                    <ProtectedRoute>
                                        <Profile />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/investigador"
                                element={
                                    <ResearcherRoute>
                                        <ResearcherDashboard />
                                    </ResearcherRoute>
                                }
                            />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Layout>
                    <Toaster />
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
        </LocaleProvider>
    );
};

export default App;
