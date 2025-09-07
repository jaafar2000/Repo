import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="bg-black absolute  w-full h-full flex justify-center items-center ">
      <div className=" opacity-100 " >
        <SignIn />
      </div>
    </div>
  );
}
