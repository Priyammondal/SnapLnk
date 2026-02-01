import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
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
import { createUrl, getUrlById, getUrls, updateUrl } from '@/db/apiUrls';
import { BeatLoader } from 'react-spinners';

const CreateLink = forwardRef((props, ref) => {
  const { user, setUrls } = UrlState();
  const navigate = useNavigate();
  const qrRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew") || "";

  const editId = searchParams.get("edit");
  const isEdit = Boolean(editId);

  const [open, setOpen] = useState(!!longLink);
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    title: "",
    longUrl: longLink ?? "",
    customUrl: "",
  });
  const [existingUrl, setExistingUrl] = useState(null);

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
  }));

  useEffect(() => {
    if (!isEdit) return;

    const fetchUrl = async () => {
      const data = await getUrlById(editId);
      if (data) {
        setFormValues({
          title: data.title,
          longUrl: data.original_url,
          customUrl: data.custom_url || "",
        });

        setExistingUrl(data);
      }
    };

    fetchUrl();
  }, [editId]);


  useEffect(() => {
    if (longLink) {
      setOpen(true);
      setFormValues((prev) => ({ ...prev, longUrl: longLink }));
    }
    if (isEdit) {
      setOpen(true);
    }
  }, [longLink, isEdit]);

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

  const { loading, error: createUrlError, data, fn: fnCreateUrl } =
    useFetch(createUrl, { ...formValues, userId: user.id });

  const { fn: fnUpdateUrl } = useFetch(updateUrl)
  const { data: newUrls, fn: fnUrls } = useFetch(getUrls, user.id);

  useEffect(() => {
    setUrls(newUrls);
  }, [newUrls])

  useEffect(() => {
    if (!createUrlError && data) {
      setSearchParams({});
      setOpen(false);
      navigate(`/link/${data[0].id}`);
    }
  }, [createUrlError, data]);

  const createNewLink = async () => {
    setErrors({});
    try {
      await schema.validate(formValues, { abortEarly: false });
      const canvas = qrRef.current?.canvasRef?.current;
      const blob = await new Promise((resolve) => canvas.toBlob(resolve));
      await fnCreateUrl(blob);
    } catch (err) {
      const newErrors = {};
      err?.inner?.forEach((e) => {
        newErrors[e.path] = e.message;
      });
      setErrors(newErrors);
    }
  };

  const updateLink = async () => {
    setErrors({});

    try {
      await schema.validate(formValues, { abortEarly: false });

      const canvas = qrRef.current?.canvasRef?.current;
      const blob = await new Promise((r) => canvas.toBlob(r));
      await fnUpdateUrl(
        {
          id: existingUrl.id,
          title: formValues.title,
          longUrl: formValues.longUrl,
          customUrl: formValues.customUrl,
          userId: user.id,
          oldQrPath: existingUrl.qr_path,
          oldShortUrl: existingUrl.short_url,
        },
        blob
      );

      setSearchParams({});
      setOpen(false);
      fnUrls();
    } catch (err) {
      const newErrors = {};
      err?.inner?.forEach((e) => {
        newErrors[e.path] = e.message;
      });
      setErrors(newErrors);
    }
  };


  const handleSubmit = async () => {
    if (isEdit) {
      await updateLink();
    } else {
      await createNewLink();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(res) => {
        setOpen(res);
        if (!res) setSearchParams({});
      }}
    >
      <DialogTrigger asChild>
        <Button variant="destructive" className="cursor-pointer">Create New Link</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg w-full p-6 sm:p-8 bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white mb-4">
            {isEdit ? "Edit Link" : "Create New Link"}
          </DialogTitle>
        </DialogHeader>

        {formValues.longUrl && (
          <div className="flex justify-center mb-6">
            <QRCode
              value={formValues.longUrl}
              size={200}
              ref={qrRef}
              className="rounded-lg border border-white/20"
            />
          </div>
        )}

        <Input
          id="title"
          placeholder="Short Link's Title"
          value={formValues.title}
          onChange={handleChange}
        />
        {errors?.title && <Error message={errors.title} />}

        <Input
          id="longUrl"
          placeholder="Enter Your Long URL"
          value={formValues.longUrl}
          onChange={handleChange}
          className="mt-3"
        />
        {errors?.longUrl && <Error message={errors.longUrl} />}

        <div className="flex items-center gap-2 mt-3">
          <Card className="p-2 bg-zinc-800 text-white">
            snaplnk.netlify.app
          </Card>
          /
          <Input
            id="customUrl"
            placeholder="Custom Link (Optional)"
            value={formValues.customUrl}
            onChange={handleChange}
          />
        </div>

        {createUrlError && <Error message={createUrlError.message} />}

        <DialogFooter className="mt-4">
          <Button onClick={handleSubmit} disabled={loading} className="cursor-pointer">
            {loading ? <BeatLoader size={10} color="white" /> : isEdit ? "Save Changes" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default CreateLink;
