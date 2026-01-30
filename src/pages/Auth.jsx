import Login from '@/components/Login';
import Signup from '@/components/Signup';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { UrlState } from '@/Context';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const longUrl = searchParams.get('createNew');
  const navigate = useNavigate();
  const { isAuthenticated, loading } = UrlState();
  const [activeTab, setActiveTab] = useState('login');

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(`/dashboard?${longUrl ? `createNew=${longUrl}` : ''}`);
    }
  }, [isAuthenticated, loading, navigate, longUrl]);

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 sm:px-6 bg-zinc-950 overflow-hidden">
      {/* Soft top glow */}
      <div className="absolute top-[-80px] left-1/2 w-[360px] h-[360px] -translate-x-1/2 rounded-full bg-destructive/20 blur-3xl" />

      {/* Card */}
      <div className="relative w-full max-w-sm sm:max-w-md bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-white">
          {activeTab === 'login'
            ? longUrl
              ? "Almost there!"
              : "Welcome back!"
            : "Join SnapLnk today!"}
        </h1>
        <p className="text-center text-sm sm:text-base text-muted-foreground">
          {activeTab === 'login'
            ? longUrl
              ? "Login to create your short link instantly."
              : "Login to manage and track your links securely."
            : "Sign up to start creating short links and track them effortlessly."}
        </p>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex w-full rounded-lg bg-white/10 p-1 gap-1">
            <TabsTrigger
              value="login"
              className="flex-1 text-center text-white rounded-lg py-2 text-sm sm:text-base data-[state=active]:bg-destructive data-[state=active]:shadow-sm transition-all"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="flex-1 text-center text-white rounded-lg py-2 text-sm sm:text-base data-[state=active]:bg-destructive data-[state=active]:shadow-sm transition-all"
            >
              Signup
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 min-h-[300px]">
            <TabsContent value="login">
              <Login />
            </TabsContent>
            <TabsContent value="signup">
              <Signup />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
