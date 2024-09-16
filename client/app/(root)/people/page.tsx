"use client";

import Loader from '@/components/Loader';
import UserCard from '@/components/cards/UserCard';
import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import ErrorPage from 'next/error'

const People = () => {
  const allUsers = useQuery(api.relationship.getAllUsers);

  if (allUsers == undefined) return <Loader/>
  return (
    <div className='flex flex-col gap-4 py-6'>
      {allUsers?.map((user: any) => (
        <UserCard key={user._id} userData={user} update={null} />
      ))}
    </div>
  )
}

export default People