"use client";

import Loader from '@/components/Loader';
import UserCard from '@/components/cards/UserCard';
import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import ErrorPage from 'next/error'

const People = () => {
  const [loading, setLoading] = useState(true)

  const [allUsers, setAllUsers] = useState<any>([])
  const getAllUsersMutation = useQuery(api.relationship.getAllUsers);

  const getAllUsers = async () => {
    const response = getAllUsersMutation;
    setAllUsers(response);
    setLoading(false)
  }

  useEffect(() => {
    getAllUsers()
  }, [])
  return loading ? <Loader /> : (
    <div className='flex flex-col gap-4 py-6'>
      {allUsers && allUsers?.map((user: any) => (
        <UserCard key={user.id} userData={user} update={getAllUsers} />
      ))}
    </div>
  )
}

export default People