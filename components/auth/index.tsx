import toast from "react-hot-toast";
export { default as Login} from './login'
export { default as ForgotPassword } from './forgotpassword'
export { default as SignUp} from './signup'
export const successToast = (msg: string) => toast.success(msg);
export const errorToast = (msg: string) => toast.error(msg);
