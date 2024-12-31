import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { Loader } from 'lucide-react';
import React from 'react'
import { ILoginResponse } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';


const ResetPassword = () => {
  const [reset, setReset] = React.useState<{ email: string; otp: string; password: string; confirmPassword: string }>({ email: "", otp: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = React.useState<boolean>(false);
  const [stage, setStage] = React.useState<number>(2);
  const [visibility, setVisibility] = React.useState<boolean>(false);
  const [error, setError] = React.useState<AxiosError | Error | string | null>(null);
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const name = evt.target.name;
    const value = evt.target.value;
    setReset({ ...reset, [name]: value });
  }

  const toggle = () => setVisibility((prop) => !prop);

  const submit1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStage(1);
    }, 2000);
    return;
    if (error) setError(null);
    setLoading(true);
    const config: AxiosRequestConfig = {
      method: "POST",
      url: "auth/get-otp",
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      data: { email: reset.email }
    }
    try {
      const res = await axios.request(config);
      const data: ILoginResponse = res.data;
      console.log(data);
    } catch (err: unknown) {
      const catchError = err as AxiosError;
      console.log({ error: catchError });
      setError("An error occurred on the server. Please try again after sometime");
      setLoading(false);
    }
  }

  const submit2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStage(2);
    }, 2000);
    return;
    if (error) setError(null);
    setLoading(true);
    const config: AxiosRequestConfig = {
      method: "POST",
      url: "auth/user/validate-otp",
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      data: { email: reset.email }
    }
    try {
      const res = await axios.request(config);
      const data: ILoginResponse = res.data;
      console.log(data);
    } catch (err: unknown) {
      const catchError = err as AxiosError;
      console.log({ error: catchError });
      setError("An error occurred on the server. Please try again after sometime");
      setLoading(false);
    }
  }

  const submit3 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      window.location.replace("/auth/login");
    }, 2000);
    return;
    if (error) setError(null);
    setLoading(true);
    const config: AxiosRequestConfig = {
      method: "POST",
      url: "auth/user/reset-password",
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      data: { email: reset.email }
    }
    try {
      const res = await axios.request(config);
      const data: ILoginResponse = res.data;
      console.log(data);
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
            <CardTitle>
              {stage === 0 && "Reset Password"}
              {stage === 1 && "Enter OTP"}
              {stage === 2 && "Enter New Password"}
            </CardTitle>
            {stage === 0 && <CardDescription>Please enter your resgistered email address to begin resetting your password</CardDescription>}
            {stage === 1 && <CardDescription>A one-time code has been sent to your resgistered email address. Please enter the code to proceed</CardDescription>}
            {stage === 2 && <CardDescription>Enter your new password</CardDescription>}
          </CardHeader>
          <CardContent>
            {
              stage === 0 &&
              <form onSubmit={submit1} className='grid gap-4'>
                <div className='grid gap-2'>
                  <Input placeholder='Enter email address' name="email" required value={reset.email} onChange={handleChange} />
                </div>
                <div>
                  <Button className='w-full' disabled={loading}>
                    {loading ? <Loader className='animate-spin w-4 h-4' /> : "Get OTP"}
                  </Button>
                </div>
              </form>
            }
            {
              stage === 1 &&
              <form onSubmit={submit2} className='grid gap-4'>
                <div className='grid gap-2'>
                  <Input placeholder='Enter code' name="otp" required value={reset.otp} onChange={handleChange} />
                </div>
                <div>
                  <Button className='w-full' disabled={loading}>
                    {loading ? <Loader className='animate-spin w-4 h-4' /> : "Validate OTP"}
                  </Button>
                </div>
              </form>
            }
            {
              stage === 2 &&
              <form onSubmit={submit3} autoComplete='stage3' className='grid gap-4'>
                <div className='relative'>
                  <Input placeholder='Enter password' name="password" required value={reset.password} type={visibility ? "text" : "password"} onChange={handleChange} />
                </div>
                <div className='relative'>
                  <Input placeholder='Confirm password' name="confirmPassword" required value={reset.confirmPassword} type={visibility ? "text" : "password"} onChange={handleChange} />
                </div>
                <div className='flex gap-2'>
                <Checkbox id="showPassword" className='text-slate-300' onCheckedChange={toggle} checked={visibility} name='showPassword' />
                <Label className='text-xs text-slate-500' htmlFor="showPassword">Show password</Label>
                </div>
                <div>
                  <Button className='w-full' disabled={loading}>
                    {loading ? <Loader className='animate-spin w-4 h-4' /> : "Submit"}
                  </Button>
                </div>
              </form>
            }
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default ResetPassword;
