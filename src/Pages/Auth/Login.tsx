import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { Eye, EyeOff, Loader } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom';
import { ILoginResponse } from '@/lib/types';
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";


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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (error) setError(null);
    setLoading(true);
    const config: AxiosRequestConfig = {
      method: "POST",
      url: "auth/login",
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      data: {
        email: login.username,
        passcode: login.password
      }
    }
    try {
      const res = await axios.request(config);
      if (res.status === 400) {
        setError("Email or password is incorrect");
        return;
      }
      const data: ILoginResponse = res.data;
      if (!data.success) {
        setError("Email or password is incorrect");
        return;
      }
      sessionStorage.setItem("user_id", data.data.user.id);
      sessionStorage.setItem("email", data.data.user.email);
      sessionStorage.setItem("token", data.data.access_token);
      window.location.replace("/dashboard");
    } catch (err: unknown) {
      const catchError = err as AxiosError;
      console.log({ error: catchError });
      setError("An error occurred on the server. Please try again after sometime");
      setLoading(false);
    }
  }

  const handleGoogleLogin = async (res: CredentialResponse) => {
    console.log({ res });
    const options: AxiosRequestConfig = {
      url: `auth/signup/google?cred=${res.credential}`,
      method: "POST"
    }
    try {
      const response = await axios.request(options);
      const data: ILoginResponse = response.data;
      if (!data.success) {
        setError("Email or password is incorrect");
        return;
      }
      sessionStorage.setItem("user_id", data.data.user.id);
      sessionStorage.setItem("email", data.data.user.email);
      sessionStorage.setItem("token", data.data.access_token);
      const url = sessionStorage.getItem("url");
      if (url) {
        window.location.replace(url);
        return;
      }
      window.location.replace("/");
      console.log(response.data);
    } catch (error) {
      console.log({ error });
    }
  }


  const handleError = () => console.log("Auth Error");

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
                <p className='text-xs text-slate-500 underline mt-1'><Link to="/auth/reset-password">Forgot password</Link></p>
              </div>
            </form>
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">OR</span>
              </div>
            </div>
            <div className="mt-6 grid place-items-center">
              {/* <Button> */}
                <GoogleLogin onSuccess={(res) => handleGoogleLogin(res)} onError={handleError} />
              {/* </Button> */}
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
