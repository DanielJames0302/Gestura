import { useState } from "react";


export default function Home() {
  const [loading, setIsLoading] = useState<boolean>(true);

  const [feedPost, setFeedPost] = useState
  return (
    <div>
      <h1 className='font-bold text-center mt-10'>Home page</h1>
    </div>
  );
}
