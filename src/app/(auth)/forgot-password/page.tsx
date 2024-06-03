import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const page = () => {
  return (
    <div className="flex gap-2 flex-col">
      <h1>Reset Password</h1>
      <Input
        className="bg-slate-950 text-white"
        type="email"
        placeholder="Email"
      />
      <Button>Login with Email</Button>
    </div>
  );
};

export default page;
