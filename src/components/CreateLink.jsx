import React, { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
    customUrl: yup.string()
      .matches(/^[a-zA-Z0-9-_]*$/, "Custom URL can only contain letters, numbers, hyphens, and underscores")
      .notRequired(),
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value,
    });
  };

  const { loading, error: createUrlError, data, fn: fnCreateUrl } = useFetch(createUrl, { ...formValues, userId: user.id });

  useEffect(() => {
    if (!createUrlError && data) {
      setSearchParams({});
      navigate(`/link/${data[0].id}`);
    }
  }, [createUrlError, data]);

  const createNewLink = async () => {
    setErrors({});
    try {
      await schema.validate(formValues, { abortEarly: false });
      const canvas = ref.current?.canvasRef?.current;
      const blob = await new Promise(resolve => canvas.toBlob(resolve));
      await fnCreateUrl(blob);
    } catch (err) {
      const newErrors = {};
      err?.inner?.forEach(e => {
        newErrors[e.path] = e.message;
      });
      setErrors(newErrors);
    }
  };

  return (
    <Dialog defaultOpen={longLink} onOpenChange={(res) => {
      if (!res) setSearchParams({});
    }}>
      <DialogTrigger>
        <Button variant="destructive" className="cursor-pointer">Create New Link</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg w-full p-6 sm:p-8 bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white text-center sm:text-left mb-4">Create New Link</DialogTitle>
        </DialogHeader>

        {/* QR Code Preview */}
        {formValues.longUrl && (
          <div className="flex justify-center mb-6">
            <QRCode value={formValues.longUrl} size={200} ref={ref} className="rounded-lg border border-white/20 shadow-md" />
          </div>
        )}

        {/* Title */}
        <div className="mb-4">
          <Input
            type="text"
            id="title"
            placeholder="Short Link's Title"
            value={formValues.title}
            onChange={handleChange}
            className="w-full bg-zinc-800 border border-white/20 placeholder:text-muted-foreground text-white focus:ring-destructive focus:border-destructive rounded-lg"
          />
          {errors?.title && <Error message={errors.title} />}
        </div>

        {/* Long URL */}
        <div className="mb-4">
          <Input
            type="text"
            id="longUrl"
            placeholder="Enter Your Long URL"
            value={formValues.longUrl}
            onChange={handleChange}
            className="w-full bg-zinc-800 border border-white/20 placeholder:text-muted-foreground text-white focus:ring-destructive focus:border-destructive rounded-lg"
          />
          {errors?.longUrl && <Error message={errors.longUrl} />}
        </div>

        {/* Custom URL */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2">
          <Card className="p-2 text-white bg-zinc-800 border border-white/20 flex-shrink-0">snaplnk.netlify.app</Card>
          <span className="text-white">/</span>
          <Input
            type="text"
            id="customUrl"
            placeholder="Custom Link (Optional)"
            value={formValues.customUrl}
            onChange={handleChange}
            className="flex-1 bg-zinc-800 border border-white/20 placeholder:text-muted-foreground text-white focus:ring-destructive focus:border-destructive rounded-lg"
          />
        </div>
        {createUrlError && <Error message={createUrlError.message} />}

        <DialogFooter className="sm:justify-end mt-4">
          <Button
            disabled={loading}
            variant="destructive"
            onClick={createNewLink}
            className="flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? <BeatLoader size={10} color='white' /> : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLink;
