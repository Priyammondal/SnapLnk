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
import Avatar from "../assets/avatar.webp"


const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profile_pic: null,
  });
  const [errors, setErrors] = useState({});
  const { data, loading, error, fn: fnSignup } = useFetch(signup, formData)
  const { setUser } = UrlState();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const longUrl = searchParams.get("createNew");
  const [preview, setPreview] = useState(null);
  const MAX_IMAGE_SIZE = 200 * 1024; // 200 KB

  useEffect(() => {
    if (data && error == null) {
      setUser(data.user);
      navigate(
        `/dashboard${longUrl ? `?createNew=${longUrl}` : ''}`,
        { replace: true }
      );
    } else {
      setErrors({ user: "User Already Registered!" });
      setTimeout(() => {
        setErrors({});
      }, 3000)
    }
  }, [data, error, navigate, longUrl])


  function handleInputChange(e) {
    const { name, value, files } = e.target;
    if (name === "profile_pic") {
      const file = files[0];
      if (file.size > MAX_IMAGE_SIZE) {
        alert("Image size must be less than 200 KB");
        e.target.value = null;
        return;
      }
      setFormData(prev => ({
        ...prev,
        profile_pic: file
      }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    }
  }, [preview]);


  const handleSignup = async () => {
    setErrors({});
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid Email').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        profile_pic: Yup.mixed().nullable(),
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
        {error && <Error message={errors.user} />}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Input autoComplete="new-name" name="name" type="text" placeholder="Enter Name" value={formData.name} onChange={handleInputChange} />
          {errors.name && <Error message={errors.name} />}
        </div>
        <div className="space-y-1">
          <Input autoComplete="new-email" name="email" type="email" placeholder="Enter Email" value={formData.email} onChange={handleInputChange} />
          {errors.email && <Error message={errors.email} />}
        </div>
        <div className="space-y-1">
          <Input autoComplete="new-password" name="password" type="password" placeholder="Enter Password" value={formData.password} onChange={handleInputChange} />
          {errors.password && <Error message={errors.password} />}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-4">
            {/* Avatar preview */}
            <label htmlFor="profile_pic" className="cursor-pointer group">
              <div className="h-10 w-10 rounded-full border-2 border-dashed border-zinc-400 flex items-center justify-center overflow-hidden group-hover:border-primary transition">
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={Avatar}
                    alt="Default Avatar"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            </label>

            {/* File input text */}
            <div className="flex-1">
              <input
                id="profile_pic"
                name="profile_pic"
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
              />
              <span className="text-sm text-muted-foreground">Click avatar to upload</span>
            </div>
          </div>

        </div>

      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button className="w-full cursor-pointer" onClick={handleSignup}>{loading ? <BeatLoader size={10} color="#FF6467" /> : 'Create Account'}</Button>
      </CardFooter>
    </Card>
  )
}

export default Signup;