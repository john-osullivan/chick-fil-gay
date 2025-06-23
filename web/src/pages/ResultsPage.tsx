import { useEffect, useState } from 'react';
import Table, { TableProps } from '../components/Table';
import Card, { CardProps } from '../components/Card';
import Stat, { StatProps } from '../components/Stat';

interface Transaction {
    date: string;
    name: string;
    amount: number;
}

const CHARITIES = [
    {
        name: 'GLAAD',
        url: (amt: number) => `https://www.glaad.org/donate?amount=${amt}`,
        logo: 'https://www.glaad.org/sites/default/files/GLAAD_logo.png',
    },
    {
        name: 'HRC',
        url: (amt: number) => `https://give.hrc.org/page/162604/donate/1?ea.tracking.id=or_gnr_hrc_website2024&transaction.donationAmt=${amt}`,
        logo: 'https://www.hrc.org/resources/images/hrc-logo.png',
    },
    {
        name: 'The Trevor Project',
        url: (amt: number) => `https://give.thetrevorproject.org/give/63307/#!/donation/checkout?amount=${amt}`,
        logo: 'https://www.thetrevorproject.org/wp-content/uploads/2018/05/trevorproject_logo.png',
    },
];

function ResultsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const stored = localStorage.getItem('chickfila_transactions');
        if (stored) {
            const txs: Transaction[] = JSON.parse(stored);
            setTransactions(txs);
            setTotal(txs.reduce((sum, t) => sum + t.amount, 0));
        }
    }, []);

    const tableProps: TableProps = {
        data: transactions,
        columns: [
            { key: 'date', label: 'Date' },
            { key: 'name', label: 'Description' },
            { key: 'amount', label: 'Amount' },
        ],
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white rounded shadow">
            <Stat label="Total Chick-fil-A Spend" value={`$${total.toFixed(2)}`} />
            <div className="flex gap-4 mb-6">
                {CHARITIES.map(c => (
                    <Card key={c.name} title={c.name}>
                        <a href={c.url(total)} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
                            <img src={c.logo} alt={c.name} className="w-24 h-24 object-contain mb-2" />
                            <span className="font-semibold">{c.name}</span>
                        </a>
                    </Card>
                ))}
            </div>
            <h3 className="font-bold mb-2">Your Chick-fil-A Transactions</h3>
            <Table {...tableProps} />
        </div>
    );
}
export default ResultsPage;
