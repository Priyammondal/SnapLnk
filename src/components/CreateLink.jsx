import React, { useEffect, useRef, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { UrlState } from '@/Context';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import Error from './Error';
import { Card } from './ui/card';
import * as yup from 'yup';
import QRCode from 'react-qrcode-logo';
import useFetch from '@/hooks/useFetch';
import { createUrl } from '@/db/apiUrls';
import { BeatLoader } from 'react-spinners';

const CreateLink = () => {
    const { user } = UrlState();
    const navigate = useNavigate();
    const ref = useRef(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const longLink = searchParams.get("createNew") || "";

    const [errors, setErrors] = useState({});
    const [formValues, setFormValues] = useState({
        title: "",
        longUrl: longLink ?? "",
        customUrl: "",
    });

    const schema = yup.object().shape({
        title: yup.string().required("Title is required"),
        longUrl: yup.string().url("Invalid URL").required("Long URL is required"),
        customUrl: yup.string().matches(/^[a-zA-Z0-9-_]*$/, "Custom URL can only contain letters, numbers, hyphens, and underscores").notRequired(),
    })

    const handleChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.id]: e.target.value,
        })
    }


    const { loading, error: createUrlError, data, fn: fnCreateUrl } = useFetch(createUrl, { ...formValues, userId: user.id });

    useEffect(() => {
        if (createUrlError === null && data) {
            navigate(`/link/${data[0].id}`);
        }

    }, [createUrlError, data]);

    const createNewLink = async () => {
        setErrors([]);
        try {
            await schema.validate(formValues, { abortEarly: false });
            const canvas = ref.current?.canvasRef?.current;
            const blob = await new Promise(resolve => canvas.toBlob(resolve));
            await fnCreateUrl(blob);
        } catch (err) {
            const newErrors = {};
            err?.inner?.forEach(e => {
                newErrors[e.path] = e.message;
            })
            setErrors(newErrors);
        }
    }

    return (
        <Dialog defaultOpen={longLink} onOpenChange={(res) => {
            if (!res) {
                setSearchParams({});
            }
        }}>
            <DialogTrigger>
                <Button variant="destructive">Create New Link</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-bold text-2xl">Create New</DialogTitle>
                </DialogHeader>
                {
                    formValues.longUrl && <div className="mx-auto" >
                        <QRCode value={formValues.longUrl} size={250} ref={ref} />
                    </div>
                }
                <Input type="text" id="title" placeholder="Short Link's Title" value={formValues.title} onChange={handleChange} />
                {errors?.title && <Error message={errors.title} />}

                <Input type="text" id="longUrl" placeholder="Enter Your Looong URL" value={formValues.longUrl} onChange={handleChange} />
                {errors?.longUrl && <Error message={errors.longUrl} />}

                <div className='flex items-center gap-2'>
                    <Card className="p-2">
                        snaplnk.netlify.app
                    </Card>
                    /
                    <Input type="text" id="customUrl" placeholder="Custom Link (Optional)" value={formValues.customUrl} onChange={handleChange} />
                </div>
                {createUrlError && <Error message={createUrlError.message} />}
                <DialogFooter className="sm:justify-end">
                    {<Button disabled={loading} variant='destructive' onClick={createNewLink}>{loading ? <BeatLoader size={10} color='white' /> : "Create"}</Button>}
                </DialogFooter>
            </DialogContent>

        </Dialog>
    )
}

export default CreateLink