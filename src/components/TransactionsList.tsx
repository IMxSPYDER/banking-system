import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import dayjs from 'dayjs';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  timestamp: string;
}

interface TransactionsListProps {
  transactions: Transaction[];
}

const TransactionsList = ({ transactions }: TransactionsListProps) => {
  if (transactions.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No transactions found. Start by making a deposit.
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('MMMM D, YYYY HH:mm');
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date & Time
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {transaction.type === 'deposit' ? (
                    <div className="flex items-center">
                      <div className="bg-green-100 p-1.5 rounded-full mr-2">
                        <ArrowUpRight size={14} className="text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">Deposit</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <div className="bg-red-100 p-1.5 rounded-full mr-2">
                        <ArrowDownRight size={14} className="text-red-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">Withdrawal</span>
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`text-sm font-medium ${
                  transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(transaction.timestamp)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsList;
