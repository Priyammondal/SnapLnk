import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BeatLoader } from "react-spinners";
import Error from './Error';
import * as Yup from 'yup';
import useFetch from '@/hooks/useFetch';
import { login } from '@/db/apiAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UrlState } from '@/Context';


const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const { data, loading, error, fn: fnLogin } = useFetch(login, formData);
    const { setUser } = UrlState();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const longUrl = searchParams.get("createNew");

    useEffect(() => {
        if (data && error == null) {
            setUser(data?.user);
            navigate(
                `/dashboard${longUrl ? `?createNew=${longUrl}` : ''}`,
                { replace: true }
            );
        }
    }, [data, loading, error, longUrl])


    function handleInputChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleLogin = async () => {
        setErrors({});
        try {
            const schema = Yup.object().shape({
                email: Yup.string().email('Invalid Email').required('Email is required'),
                password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
            })
            await schema.validate(formData, { abortEarly: false });
            const res = await fnLogin();
            if (!res) {
                setErrors({ credential: "Invalid Login Credentials!" });
                setTimeout(() => {
                    setErrors({});
                }, 3000)
            }
        } catch (err) {
            const newErrors = {};
            err?.inner?.forEach((error) => {
                newErrors[error.path] = error.message;
            })
            setErrors(newErrors);
        }
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                    to your account if you already have one
                </CardDescription>
                {errors?.credential && <Error message={errors?.credential} />}
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="space-y-1">
                    <Input name="email" type="email" placeholder="Enter Email" value={formData.email} onChange={handleInputChange} />
                    {errors.email && <Error message={errors.email} />}
                </div>
                <div className="space-y-1">
                    <Input name="password" type="password" placeholder="Enter Password" value={formData.password} onChange={handleInputChange} />
                    {errors.password && <Error message={errors.password} />}
                </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button className="w-full cursor-pointer" onClick={handleLogin}>{loading ? <BeatLoader size={10} color="#FF6467" /> : 'Login'}</Button>
            </CardFooter>
        </Card>
    )
}

export default Login