"use client";

import { UserDetailContext } from "@/context/UserDetailContext";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

function Provider({ children }: { children: React.ReactNode }) {
  const [userDetail, setUserDetail] = useState<any>(null);

  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      CreateNewUser();
    } else {
      setUserDetail(null);
    }
  }, [isLoaded, isSignedIn])

  const CreateNewUser = async () => {
    try {
      const result = await axios.post('/api/user', {});
      setUserDetail(result.data);
      console.log(result.data);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <div>{children}</div>
    </UserDetailContext.Provider>
  );
}

export default Provider;
