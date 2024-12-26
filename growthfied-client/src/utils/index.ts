import { CartItem } from "@/types/store/cart";
import { BACKEND_URL } from "../../config";
import noImageUrl from "../../public/settings/no-product.webp"

// products
export const calculateDiscountedPrice = (originalPrice: number, discountPercentage: number) => {
  return 0
}

export const getTotalPMOfferAmount = (items: CartItem[]) => {
  return items.reduce((total, item) => {
    if (item?.discount_based_pm?.allow) {
      const offerAmount = (item.selling_price - item?.discount_based_pm?.selling_price) * item.quantity;
      return total + offerAmount;
    }
    return total;
  }, 0);
};


export const getProductDiscountPercentage = (sellingPrice: number, originalPrice: number): number => {
  if (originalPrice <= 0) return 0

  const discountPercentage = ((originalPrice - sellingPrice) / originalPrice) * 100;
  return parseFloat(discountPercentage.toFixed(2));
};

export const getTotalQuanityFromVariantsOptions = (optionsQuantity: any, options: any) => {
  let optionOne = 0
  let optionTwo = 0
  let optionThree = 0
  let optionFour = 0

  if(options.option_one !== "") optionOne = optionsQuantity?.option_one
  if(options.option_two !== "") optionTwo = optionsQuantity?.option_two
  if(options.option_three !== "") optionThree = optionsQuantity?.option_three
  if(options.option_four !== "") optionFour = optionsQuantity?.option_four

  const finalResult = optionOne + optionTwo + optionThree + optionFour

  return finalResult
}

export const convertToSlug = (title: string) => {
    title = title.toLowerCase();
    title = title.replace(/[^a-z0-9]+/g, '-');
    title = title.replace(/^-+|-+$/g, '');
    return title;
}

export const getProductThumbnail = (data: any): string => {
  const defaultImageSrc = noImageUrl;
  let selectedImageSrc: any = defaultImageSrc;

  if (data?.images.image_one !== 'no_image') {
    selectedImageSrc = `${BACKEND_URL}/public/images/products/${data?.images.image_one}`;
  } else if (data?.images.image_two !== 'no_image') {
    selectedImageSrc = `${BACKEND_URL}/public/images/products/${data?.images.image_two}`;
  } else if (data?.images.image_three !== 'no_image') {
    selectedImageSrc = `${BACKEND_URL}/public/images/products/${data?.images.image_three}`;
  }

  return selectedImageSrc;
}

// coupens
export const formatDate = (dateString: any) => {
  const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
  ];

  const date = new Date(dateString);
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  const formattedDate = `${day} ${months[monthIndex]} ${year}`;
  return formattedDate;
}

export const getCoupenStatus = (end_date: string, used: number, count: number) => {
  const todayDate = new Date()
  const endDate = new Date(end_date)
  const isExpired = endDate < todayDate
  if(isExpired === true) return "Expired"
  if(count - used === 0) return "Completed"
  return "Running"
}

export const getDefaultDate = (dateString: string) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
}

// orders
export async function createFileFromBlobUrl(imageUrl: string): Promise<File> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error('Network response was not ok');

    const blob = await response.blob();

    const match = imageUrl.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
    const fileExtension = match ? match[1] : null;

    const file = new File([blob], `${`file_`+Date.now()+"."+fileExtension}`, {
      type: blob.type,
      lastModified: Date.now()
    });

    return file;
  } catch (error) {
    console.error('Error processing Blob URL:', error);
    throw error;
  }
}

export const getSomeOfItems = (items: CartItem[]) => {
  return items.reduce((acc, { selling_price, quantity }) => acc + selling_price * quantity, 0)
}

export const getItemsDiscount = (items: CartItem[]) => {
  let totalDiscount = 0;
      items.forEach(product => {
        if(product.original_price > product.selling_price){
          const original_price = (product.original_price - product.selling_price) * product.quantity;
          totalDiscount += original_price;
        }
    });
    return totalDiscount
}

export const getItemsOriginalPrice = (items: CartItem[]) => {
  let totalOriginalPrice  = 0;
  items.forEach(product => {
    totalOriginalPrice += product.original_price * product.quantity;
  });
return totalOriginalPrice 
}

export const getCoupenPercentDiscount = (totalPrice: number, discountPercentage: number) => {
  const discountAmount = (discountPercentage / 100) * totalPrice;
  return discountAmount;
}

export const formatOrderDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`; // Format as YYYY-MM-DD
};

export const formatOrderTime = (date: Date): string => {
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert to 12-hour format, 0 becomes 12
  return `${hours}:${minutes} ${ampm}`;
};

export const formatDateDDMMYYYY = (dateStr: any) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const formatDateYYYYMMDD = (dateStr: any) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

// analytics
export const formatVisitorCount = (count: number) => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + "M"; // Format as million
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + "K"; // Format as thousand
  } else {
    return count.toString(); // Return the count as is if less than 1000
  }
};

export const formatTimeFromString = (input: string): string => {
  const seconds = parseFloat(input);
  
  if (seconds < 60) {
    return `${seconds.toFixed(2)} seconds`; // Less than 60 seconds
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60); // Convert to minutes
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600); // Convert to hours
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  } else {
    const days = Math.floor(seconds / 86400); // Convert to days (if necessary)
    return `${days} day${days > 1 ? 's' : ''}`;
  }
};
