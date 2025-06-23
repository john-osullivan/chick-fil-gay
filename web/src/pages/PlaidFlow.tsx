import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPlaidLinkToken, exchangePlaidPublicToken, fetchPlaidTransactions } from '../services/api';
import { PlaidLink } from 'react-plaid-link';

function PlaidFlow() {
    const [linkToken, setLinkToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Fetch Plaid link token on mount
    useEffect(() => {
        const userId = crypto.randomUUID();
        createPlaidLinkToken(userId)
            .then(data => setLinkToken(data.link_token))
            .catch(() => setError('Failed to create Plaid link token.'));
    }, []);

    const onSuccess = useCallback(async (public_token: string) => {
        try {
            const { access_token } = await exchangePlaidPublicToken(public_token);
            const { transactions } = await fetchPlaidTransactions(access_token);
            // Filter for Chick-fil-A
            const chickfila = transactions.filter((t: any) =>
                /chick.?fil.?a/i.test(t.name)
            ).map((t: any) => ({ date: t.date, name: t.name, amount: t.amount }));
            localStorage.setItem('chickfila_transactions', JSON.stringify(chickfila));
            navigate('/results');
        } catch {
            setError('Failed to fetch transactions.');
        }
    }, [navigate]);

    if (error) return <div className="text-red-600">{error}</div>;
    if (!linkToken) return <div>Loading Plaid...</div>;

    return (
        <div className="max-w-lg mx-auto p-8 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Sync your account</h2>
            <p className="mb-4">Pick the account where you think most of your Chick-fil-A spend happened. We do not store your transaction records; they are processed on your device.</p>
            <PlaidLink
                token={linkToken}
                onSuccess={onSuccess}
                onExit={() => setError('Plaid flow exited.')}
            >
                <button className="bg-blue-600 text-white px-4 py-2 rounded">Connect with Plaid</button>
            </PlaidLink>
        </div>
    );
}
export default PlaidFlow;
