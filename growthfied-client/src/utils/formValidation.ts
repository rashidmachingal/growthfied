type FormData = {
    [key: string]: any; 
}

export const formValidation = (validationFields: FormData, excludedFields?: string[]) => {
    const errors: Record<string, string> = {};
    const inputFields = Object.keys(validationFields);
    
    inputFields.forEach((field) => {
        if (!validationFields[field] && (!excludedFields || !excludedFields.includes(field))) {
            errors[field] = `*Please enter ${field.replace("_", " ")}`;
        }else{
           switch(field){
            case "username":
                if (/[!@#$%^&*`()+{}\[\]:;<>,?~\\/]/.test(validationFields[field])) {
                    errors[field] = `*Don't use special characters eg: !@#$%^&*`;
                } else if(validationFields[field].length > 30){
                    errors[field] = `*Length should not exceed 30 characters`;
                }
                break
            case "mobile_number":
                if(validationFields[field].length < 10 ){
                    errors[field] = `*Please enter valid mobile number`;
                }
                break
            case "pincode":
                if(validationFields[field].length < 6 ){
                    errors[field] = `*Please enter valid mobile number`;
                }
                break

            case "email":
                 if (!/\S+@\S+\.\S+/.test(validationFields[field])) {
                    errors[field] = "*Please enter a valid email";
                }
                break;

                case "confirm_password":
                    if (validationFields[field] !== validationFields?.password && validationFields[field] !== validationFields?.new_password) {
                      errors[field] = "*Password not match";
                    }
                break;
           }
        }
    });

    return errors;

};
