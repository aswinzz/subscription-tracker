import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useAuth from "@/hooks/useAuth";
import { useCallback, useEffect, useState } from "react";

export function Auth() {
    const [authType, setAuthType] = useState("login");
    const [session, actions] = useAuth();
    const [error, setError] = useState<string | undefined>();
    const [email, setEmail] = useState<string | undefined>();
    const [password, setPassword] = useState<string | undefined>();

    const onSwitch = useCallback(() => {
        setAuthType(authType === "login" ? "signup" : "login");
    }, [authType]);

    const validateForm = useCallback((email: string | undefined, password: string | undefined) => {
        // console.log(email, !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))
        if (!email || !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
            setError("Invalid email");
            return;
        }
        if (!password || password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }
        setError(undefined);
    }, []);

    const onEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("EC", e.target.value);
        setEmail(e.target.value);
        validateForm(e.target.value, password);
    }, [password, validateForm]);

    const onPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("PC", e.target.value);
        setPassword(e.target.value);
        validateForm(email, e.target.value);
    }, [email, validateForm]);

    const onSubmit = useCallback(async () => {
        console.log("CLICKED", email, password);
        let result;
        if (email && password) {
            if (authType === "login") {
                result = await actions.login(email, password);
                console.log("result", result);
            } else {
                result = await actions.signUp(email, password);
                console.log("result", result);
            }
        }
        if (result?.error?.message) {
            setError(result.error.message);
        } else {
            actions.reloadSession();
        }
    }, [actions, authType, email, password]);

    if (session) {
        return <Button onClick={actions.signOut}>Logout</Button>;
    }

    

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Login</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{authType === "login" ? "Login" : "Sign Up"}</DialogTitle>
                <DialogDescription>
                Authenticate using email & password
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                    Email
                </Label>
                <Input value={email} onChange={onEmailChange} id="email" placeholder="aswinvb.aswin6@gmail.com" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                    Password
                </Label>
                <Input value={password} onChange={onPasswordChange} id="password" placeholder="********" type="password" className="col-span-3" />
                </div>
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {/* <DialogFooter className="w-full"> */}
                <Button disabled={(!!error || !password || !email)} onClick={onSubmit} type="submit">{authType === "login" ? "Login" : "Sign up"}</Button>
            {/* </DialogFooter> */}
            <div className="flex items-center justify-center text-xs">
                <a onClick={onSwitch}>{authType === "login" ? "Do not have an account ?" : "Already have an account ?"}</a>
            </div>
            </DialogContent>
        </Dialog>
    )
}
