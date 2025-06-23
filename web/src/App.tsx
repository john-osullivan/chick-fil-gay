import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import DonationFlow from '../pages/DonationFlow';
import PlaidFlow from '../pages/PlaidFlow';
import ResultsPage from '../pages/ResultsPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/donate" element={<DonationFlow />} />
            <Route path="/plaid" element={<PlaidFlow />} />
            <Route path="/results" element={<ResultsPage />} />
        </Routes>
    );
}

export default App;
