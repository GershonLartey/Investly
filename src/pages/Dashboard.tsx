import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { toast } = useToast();
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth and handle session changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: profile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      return data;
    },
    enabled: !!session?.user?.id && !isLoading,
  });

  const { data: transactions } = useQuery({
    queryKey: ['transactions', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }
      return data || [];
    },
    enabled: !!session?.user?.id && !isLoading,
    retry: false,
  });

  const { data: activeInvestments } = useQuery({
    queryKey: ['active-investments', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('status', 'active');
      
      if (error) {
        console.error('Error fetching investments:', error);
        throw error;
      }
      return data || [];
    },
    enabled: !!session?.user?.id && !isLoading,
    retry: false,
  });

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session) {
    return <div className="flex items-center justify-center min-h-screen">Please log in to view your dashboard</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Balance</h3>
          <p className="text-2xl font-bold text-gray-900">
            ${profile?.balance?.toFixed(2) || '0.00'}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Investments</h3>
          <p className="text-2xl font-bold text-gray-900">
            {activeInvestments?.length || 0}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Returns</h3>
          <p className="text-2xl font-bold text-gray-900">$0.00</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/deposit">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="text-lg font-medium text-gray-900">Make a Deposit</h3>
            <p className="text-gray-500">Add funds to your investment account</p>
          </Card>
        </Link>
        <Link to="/withdrawal">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="text-lg font-medium text-gray-900">Request Withdrawal</h3>
            <p className="text-gray-500">Withdraw funds from your account</p>
          </Card>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        {transactions && transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium capitalize">{transaction.type}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${
                    transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">{transaction.status}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            No recent transactions
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;