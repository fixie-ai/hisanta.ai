//import { signIn } from "next-auth/react";
import { signIn } from "@/lib/auth";
import { Button } from "../ui/button";

export function LoginButton() {

    const doSignIn = async () => {
        await signIn();
    };
    return (
        <Button onClick={doSignIn}>Sign in</Button>
    );
}

// export function SignIn({
//   provider,
//   ...props
// }: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
//   return (
//     <form
//       action={async () => {
//         "use server"
//         await signIn(provider)
//       }}
//     >
//       <Button {...props}>Sign In</Button>
//     </form>
//   )
// }