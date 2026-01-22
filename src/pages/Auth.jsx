import Login from '@/components/Login';
import Signup from '@/components/Signup';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { UrlState } from '@/Context';
import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const Auth = () => {
  const [searcParams] = useSearchParams();
  const longUrl = searcParams.get('createNew');
  const navigate = useNavigate();
  const { isAuthenticated, loading } = UrlState();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(`/dashboard?${longUrl ? `createNew=${longUrl}` : ''}`);
    }
  }, [isAuthenticated, loading, navigate, longUrl]);

  return (
    <div className='mt-20 flex flex-col items-center gap-10'>
      <h1 className='text-5xl font-extrabold'>
        {longUrl ? "Hold up! Let's login first..." : 'Login / Signup'}
      </h1>
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">
            Login
          </TabsTrigger>
          <TabsTrigger value="signup">
            Signup
          </TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Login />
        </TabsContent>
        <TabsContent value="signup">
          <Signup />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Auth