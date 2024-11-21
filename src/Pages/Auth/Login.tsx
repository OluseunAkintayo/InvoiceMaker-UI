import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { Eye, EyeOff, Loader } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom';
import { ILoginResponse } from '@/lib/types';

const Login = () => {
  const [login, setLogin] = React.useState<{ username: string; password: string; }>({ username: "", password: "" });
  const [loading, setLoading] = React.useState<boolean>(false);
  const [visibility, setVisibility] = React.useState<boolean>(false);
  const [error, setError] = React.useState<AxiosError | Error | string | null>(null);
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const name = evt.target.name;
    const value = evt.target.value;
    setLogin({ ...login, [name]: value });
  }

  const { toast } = useToast();
  const showMessage = () => {
    toast({
      className: 'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4',
      title: "Coming soon!",
      description: "This feature will be available soon 😊",
    });
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (error) setError(null);
    setLoading(true);
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 2000)
    return;
    const config: AxiosRequestConfig = {
      method: "POST",
      url: "auth/user/login",
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      data: {
        email: login.username,
        password: login.password
      }
    }
    try {
      const res = await axios.request(config);
      console.log(res);
      if (res.status === 400) {
        setError("Incorrect username or password");
        return;
      }
      const data: ILoginResponse = res.data;
      if (!data.success) {
        setError("Error logging in");
        console.log(res);
        return;
      }
      sessionStorage.setItem("user", data.data.email);
      sessionStorage.setItem("token", data.data.token);
      sessionStorage.setItem("exp", data.data.exp);
      sessionStorage.setItem("role", data.data.role.toString());
      // setLoading(false);
      window.location.replace("/dashboard");
    } catch (err: unknown) {
      const catchError = err as AxiosError;
      console.log({ error: catchError });
      setError("An error occurred on the server. Please try again after sometime");
      setLoading(false);
    }
  }

  return (
    <div className='h-[100dvh] grid place-items-center'>
      <div className="p-4">
        <Card className='w-full sm:min-w-[400px] min-w-0 max-w-[400px] shadow-lg'>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Please enter username and password to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className='grid gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor="email">Username</Label>
                <Input placeholder='Enter username' name="username" required value={login.username} onChange={handleChange} />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor="email">Password</Label>
                <div className='relative'>
                  <Input placeholder='Enter password' className='pr-12' type={visibility ? "text" : "password"} name="password" required value={login.password} onChange={handleChange} />
                  <span className='absolute top-0 bottom-0 right-0 px-2 grid place-items-center cursor-pointer' onClick={() => setVisibility(item => !item)}>
                    {visibility ? <EyeOff className='h-5 text-gray-500' /> : <Eye className='h-5 text-gray-500' />}
                  </span>
                </div>
              </div>

              <div>
                <Button className='w-full' disabled={loading}>
                  {loading ? <Loader className='animate-spin w-4 h-4' /> : "Login"}
                </Button>
              </div>
            </form>
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>
            <div className="mt-6">
              <Button
                variant="outline"
                className="w-full"
                onClick={showMessage}
              >
                <img src="/assets/google.svg" className='w-5 mr-1' />
                Sign in with Google
              </Button>
            </div>
            <p className="mt-4 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/auth/register" className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                Sign up
              </Link>
            </p>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default Login;
