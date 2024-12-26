"use client";

import Image from "next/image";
import { useState, ChangeEvent, ChangeEventHandler, Dispatch, SetStateAction, useEffect } from "react";
import { Button, Div, InputField, Label, PlainButton, Span, Typography } from "@/interface/fragments";
import { Popup } from "@/interface/components";
import { CloseButtonIcon,  CloudUploadIcon, ExclamationIcon, LoadingIcon, TickIcon } from "@/interface/icons";
import { toast } from "sonner";
import { uploadUserPhotos } from "@/@api/store/orders.api";
import { PhotosDataTypes } from "@/types/store/cart";
import { BACKEND_URL } from "../../../../../config";
import { useCartStore } from "@/zustand/store/cartStore";
import { createFileFromBlobUrl } from "@/utils";
import imageCompression from 'browser-image-compression';
import AddImage from "../../../../../public/settings/add-image.svg";


type UserUploadImageProps = {
  number: number;
  photosData: PhotosDataTypes
  setPhotosData: Dispatch<SetStateAction<PhotosDataTypes>>
  id: any;
  setTempImgId: Dispatch<any>
  errorMessages: { photos: boolean, message: boolean }
  setErrorMessages: Dispatch<SetStateAction<{
   photos: boolean;
   message: boolean;
 }>>
};

type PhotoLabelMap = {
  [key: number]: "image_one" | "image_two" | "image_three" | "image_four";
};

const photosLabels: PhotoLabelMap = {
  1: "image_one",
  2: "image_two",
  3: "image_three",
  4: "image_four",
};

export default function UserUploadImages({ number, photosData, setPhotosData, id, setTempImgId, errorMessages, setErrorMessages }: UserUploadImageProps) {

  const { items, update_tempimg_id, update_customer_photos } = useCartStore();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [isPhotosUploaded, setIsPhotosUploaded] = useState(false)
  const [isImageAdded, setIsImageAdded] = useState(true)
  const [imageLoading, setImageLoading] = useState(true)
  const [loadingStates, setLoadingStates] = useState({
    image_one: false,
    image_two: false,
    image_three: false,
    image_four: false,
  });

  useEffect(() => {
    setImageLoading(false)
    loadStoredImages()
    setIsImageAdded(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const loadStoredImages = async () => {
    const storedImages = localStorage.getItem(id);
    if (storedImages) {
      const newImages = JSON.parse(storedImages);

      console.log(newImages.image_one)

      setPhotosData((prevData) => ({
        ...prevData,
        temporary_image_urls: newImages
      }))

      const imageFiles = await Promise.all([
        createFileFromBlobUrl(newImages.image_one),
        createFileFromBlobUrl(newImages.image_two),
        createFileFromBlobUrl(newImages.image_three),
        createFileFromBlobUrl(newImages.image_four),
      ]);

      setPhotosData((prevData) => ({
        ...prevData,
        images: {
          image_one: imageFiles[0],
          image_two: imageFiles[1],
          image_three: imageFiles[2],
          image_four: imageFiles[3],
        }
      }))

      
      if (newImages.image_one) {
        setIsPhotosUploaded(true);
      }
    }
  }

  //const loadStateImages = () => {
  //  items.forEach((item) => {
  //    if(item.id === id){
  //      setPhotosData((prevData) => ({
  //        images: {
  //          ...prevData.images,
  //        },
  //        temporary_image_urls: item.customer_photos,
  //      }));
  //      if(item.customer_photos.image_one) setIsPhotosUploaded(true)
  //    }
  //   })
  //}
  

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {

    setLoadingStates((prevData) => ({
      ...prevData,
      [e.target.name]: true
    }))

    const image_file = e.target.files ? e.target.files[0] : null;
    if (image_file) {

      if (image_file.size > 12 * 1024 * 1024) {
        setLoadingStates((prevData) => ({
          ...prevData,
          [e.target.name]: false
        }))
        return toast.error("Image Size: Keep it under 12MB",
          { icon: <ExclamationIcon className="!fill-yellow-500" /> })
      }

       // Options for compression
       const options = {
        maxSizeMB: Infinity, 
        maxWidthOrHeight: undefined, 
        useWebWorker: true,
        initialQuality: 1.0,
        alwaysKeepResolution: true,
      };

      try {
        let compressedBlob = await imageCompression(image_file, options);
        const compressedFile = new File([compressedBlob], image_file.name, {
          type: compressedBlob.type,
        });
        setPhotosData((prevData) => ({
          images: {
            ...prevData.images,
            [e.target.name]: compressedFile,
          },
          temporary_image_urls: {
            ...prevData.temporary_image_urls,
            [e.target.name]: URL.createObjectURL(image_file),
          },
        }));
      } catch (error) {
        setPhotosData((prevData) => ({
          images: {
            ...prevData.images,
            [e.target.name]: image_file,
          },
          temporary_image_urls: {
            ...prevData.temporary_image_urls,
            [e.target.name]: URL.createObjectURL(image_file),
          },
        }));
      }finally{
        setLoadingStates((prevData) => ({
          ...prevData,
          [e.target.name]: false
        }))
      }

      
    }
  };

  const handleRemoveImage = (image_name: string) => {
    setPhotosData((prevData) => ({
      ...prevData,
      images: {
        ...prevData.images,
        [image_name] : ""
      },
      temporary_image_urls: {
        ...prevData.temporary_image_urls,
        [image_name]: null
      }
    }))
  }

  const handleSubmit = async () => {

    for (let i = 0; i < number; i++) {
      if (photosData.temporary_image_urls[photosLabels[i+1]] === null) {
        setIsImageAdded(false);
        return;
      }
    }
      
    setIsImageAdded(true)

    let allIncludeBackendUrl = true;
    Object.values(photosLabels).forEach(label => {
      const imageUrl = photosData.temporary_image_urls[label];
      if (imageUrl && !imageUrl.includes(BACKEND_URL)) {
        allIncludeBackendUrl = false;
      }
    });
    if (allIncludeBackendUrl) return setOpen(false);

    setLoading(true)
    const formData = new FormData();
    formData.append('image_one', photosData.images.image_one);
    formData.append('image_two', photosData.images.image_two);
    formData.append('image_three', photosData.images.image_three);
    formData.append('image_four', photosData.images.image_four);

     try {
      const res = await uploadUserPhotos(formData)
      toast.success("Photos uploaded successfully")
      setIsPhotosUploaded(true)
      setLoading(false)
      setOpen(false)

      // for update
      const newImages = {
        image_one: "",
        image_two: "",
        image_three: "",
        image_four: ""
      }

      setTempImgId(res.data.tempimg_id)
      res.data.images.map((item: any, index: number) => {
        setPhotosData((prevData) => ({
          ...prevData,
          temporary_image_urls: {
            ...prevData.temporary_image_urls,
            [photosLabels[index + 1]]: `${BACKEND_URL}/public/images/order/${item?.file_name}`
          },
        }));
        newImages[photosLabels[index+1]] = `${BACKEND_URL}/public/images/order/${item?.file_name}`
      })

      // storing temp images to localstorage
      localStorage.setItem(id, JSON.stringify(newImages));
      localStorage.setItem(`${"tempimg_id-" + id}`, JSON.stringify(res.data.tempimg_id))

      // update images if added to cart
      update_customer_photos(id, newImages)
      update_tempimg_id(id, res.data.tempimg_id)

    } catch (error) {
      console.log(error,"@error")
      toast.error("Photos upload failed, try again")
      setLoading(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
      setImageLoading(false)
      loadStoredImages()
      setIsImageAdded(true)
  }

  return (
    <>
      { isPhotosUploaded === false && imageLoading === false && (
        <>
        <Button
         onClick={() => {setOpen(true), setErrorMessages((prevData) => ({
          ...prevData,
          photos: false
         }))}}
         className={`!bg-gray-100 !text-black gap-2 border ${errorMessages.photos && "border-red-500 !text-red-500"}`}
         >
         <CloudUploadIcon/>
         Upload {number === 1 ? "Photo": "Photos"}
        </Button>
        { errorMessages.photos && <Typography className="text-[12px] text-red-500" >
          *Please upload {number === 1 ? "Photo": "Photos"}
        </Typography>}
        </>
    )}

      { isPhotosUploaded === true && imageLoading === false && (
        <Button
         onClick={() => setOpen(true)}
         className="!bg-gray-100 !text-black gap-2 border"
        >
        Saved - Change {number === 1 ? "Photo": "Photos"}
        <TickIcon className="fill-green-500" />
      </Button>
     )}

      { imageLoading === true && (
        <Button
         onClick={() => setOpen(true)}
         className="!bg-gray-100 !text-black gap-2 border"
        >
        <LoadingIcon className="animate-spin" />
      </Button>
     )}

      <Popup open={open}>
        <Div className="w-[95vw] lg:w-[40vw] shadow bg-white rounded-theme p-5 pt-4">
          <Div className="flex items-center justify-between border-b pb-2">
            <Typography className="font-medium">Upload {number === 1 ? "Photo": "Photos"}</Typography>
          </Div>

          <Div className="flex gap-3 mt-3 w-full flex-wrap">
            {[...Array(number)].map((_, idx) => {
              return (
                <ImageBox
                  key={idx}
                  number={idx + 1}
                  image={photosData.temporary_image_urls[photosLabels[idx + 1]]}
                  handleImageChange={handleImageChange}
                  handleRemoveImage={handleRemoveImage}
                  isImageAdded={isImageAdded}
                  isUploading={loadingStates[photosLabels[idx+1]]}
                />
              );
            })}
            { isImageAdded === false && <Div className="w-full" >
            <Typography className="text-center text-[12px] text-red-500" >Please upload photos to continue</Typography>
            </Div>}
          </Div>

          <Div className="mt-[30px] flex justify-end gap-3">
            <Button
              onClick={handleClose}
              className="!h-[2rem] w-[5rem] border-black !bg-gray-200 hover:!bg-gray-300 !text-black"
            >
              Close
            </Button>
            <Button disabled={loading} onClick={handleSubmit} className="!h-[2rem] w-[7rem]">
            {loading ? <LoadingIcon className="animate-spin" /> : "Upload"}
            </Button>
          </Div>
        </Div>
      </Popup>
    </>
  );
}

type ImageBoxProps = {
  number: number;
  image: any;
  handleImageChange: ChangeEventHandler<HTMLInputElement>;
  handleRemoveImage: (image_name: string) => void
  isImageAdded: boolean
  isUploading: boolean
};

function ImageBox({ number, image, handleImageChange, handleRemoveImage, isImageAdded, isUploading }: ImageBoxProps) {
  return (
    <Div className="flex flex-col gap-1 w-[48%] lg:w-[48%]">
      {image ? (
        <>
          <Typography className="text-[14px]">Image {number}</Typography>
          <Div className="h-[10rem] w-[100%] flex flex-col items-center justify-center gap-2 rounded-theme border-2 relative">
            <Image
              className="w-full h-full"
              width={350}
              height={350}
              src={image}
              alt="add image"
            />
          <PlainButton onClick={()=> handleRemoveImage(photosLabels[number])} className="rounded-full flex items-center justify-center text-[14px] absolute top-[-10px] right-[-10px] z-10 bg-red-600 hover:bg-red-700 w-[1.5rem] h-[1.5rem] cursor-pointer">
            <CloseButtonIcon className="!stroke-white" />
          </PlainButton>
          </Div>
        </>
      ) : (
        <>
          <Typography className="text-[14px]">Image {number}</Typography>
          <Label className={`bg-gray-100 h-[10rem] w-[100%] flex flex-col items-center justify-center gap-2 rounded-theme hover:border-black border-2 cursor-copy ${isImageAdded === false && "border-red-500"}`}>
            {isUploading ? <LoadingIcon className="animate-spin" /> : (
            <>
            <Image
              className="w-[2.5rem]"
              width={0}
              height={100}
              src={AddImage}
              alt="add image"
            />
            <Typography className="mt-[2px] text-[10px] text-gray-700 text-center">
              Click to add photo
            </Typography>
            </>
            ) }
            
            
            <InputField
              type="file"
              accept="image/*"
              className="hidden"
              name={photosLabels[number]}
              onChange={handleImageChange}
            />
          </Label>
        </>
      )}
    </Div>
  );
}
