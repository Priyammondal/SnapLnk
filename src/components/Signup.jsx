import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
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
import { signup } from '@/db/apiAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UrlState } from '@/Context';


const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profile_pic: null,
  });
  const [errors, setErrors] = useState([]);
  const { data, loading, error, fn: fnSignup } = useFetch(signup, formData)
  const { fetchUser } = UrlState();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const longUrl = searchParams.get("createNew");

  console.log("data-->", data)

  useEffect(() => {
    if (data && error == null) {
      console.log('Login Successful', data);
      navigate(`/dashboard?${longUrl ? `createNew=${longUrl}` : ''}`);
      fetchUser();
    }
  }, [data, error, navigate, longUrl])


  function handleInputChange(e) {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }))
  }

  const handleSignup = async () => {
    setErrors([]);
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid Email').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        profile_pic: Yup.mixed().required('Profile picture is required'),
      })
      await schema.validate(formData, { abortEarly: false });
      await fnSignup();
    } catch (err) {
      const newErrors = {};
      err?.inner?.forEach((error) => {
        newErrors[error.path] = error.message;
      })
      setErrors(newErrors);
    }
  }

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Signup</CardTitle>
        <CardDescription>
          Create a new accout if you haven't already
        </CardDescription>
        {error && <Error message={errors.password} />}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Input autocomplete="off" name="name" type="text" placeholder="Enter Name" value={formData.name} onChange={handleInputChange} />
          {errors.name && <Error message={errors.name} />}
        </div>
        <div className="space-y-1">
          <Input autocomplete="off" name="email" type="email" placeholder="Enter Email" value={formData.email} onChange={handleInputChange} />
          {errors.email && <Error message={errors.email} />}
        </div>
        <div className="space-y-1">
          <Input autocomplete="off" name="password" type="password" placeholder="Enter Password" value={formData.password} onChange={handleInputChange} />
          {errors.password && <Error message={errors.password} />}
        </div>
        <div className="space-y-1">
          <Input autocomplete="off" name="profile_pic" type="file" accept="image/*" onChange={handleInputChange} />
          {errors.profile_pic && <Error message={errors.profile_pic} />}
        </div>

      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button className="w-full" onClick={handleSignup}>{loading ? <BeatLoader size={10} color="#36d7b7" /> : 'Create Account'}</Button>
      </CardFooter>
    </Card>
  )
}

export default Signup;