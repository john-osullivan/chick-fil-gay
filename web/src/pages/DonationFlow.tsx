import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createStripeSession, validateStripeSession } from '../src/services/api';

function DonationFlow() {
    const [step, setStep] = useState<'intro' | 'pay' | 'validating' | 'plaid' | 'error'>('intro');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    // 1. Start payment
    const startPayment = async () => {
        setStep('pay');
        try {
            const data = await createStripeSession();
            window.location.href = data.url;
        } catch (e) {
            setError('Failed to start payment.');
            setStep('error');
        }
    };

    // 2. Validate payment if redirected back
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const checkoutSessionId = params.get('CHECKOUT_SESSION_ID');
        if (checkoutSessionId) {
            setStep('validating');
            validateStripeSession(checkoutSessionId)
                .then(data => {
                    if (data.paid) {
                        setStep('plaid');
                        navigate('/plaid');
                    } else {
                        setError('Payment not found or not completed.');
                        setStep('error');
                    }
                })
                .catch(() => {
                    setError('Failed to validate payment.');
                    setStep('error');
                });
        }
    }, [location.search, navigate]);

    if (step === 'intro') {
        return (
            <div className="max-w-lg mx-auto p-8 bg-white rounded shadow">
                <h2 className="text-2xl font-bold mb-4">Connect your account</h2>
                <p className="mb-4">We use Plaid to securely pull your Chick-fil-A transactions. This costs $2 per account, which keeps the site cost-neutral. You’ll pay this fee before connecting your bank.</p>
                <button className="bg-pink-600 text-white px-4 py-2 rounded" onClick={startPayment}>
                    By clicking, you accept our terms and conditions
                </button>
            </div>
        );
    }
    if (step === 'pay') {
        return <div>Redirecting to payment...</div>;
    }
    if (step === 'validating') {
        return <div>Validating payment...</div>;
    }
    if (step === 'error') {
        return <div className="text-red-600">{error}</div>;
    }
    return null;
}
export default DonationFlow;
