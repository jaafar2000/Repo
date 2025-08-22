import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="bg-black opacity-90  w-full h-full absolute flex justify-center items-center ">
      <div className=" opacity-100 " >
        <SignIn />
      </div>
    </div>
  );
}
