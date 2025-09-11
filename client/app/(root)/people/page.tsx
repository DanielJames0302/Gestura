"use client";

import Loader from '@/components/Loader';
import UserCard from '@/components/cards/UserCard';
import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import React, { useState } from 'react'
import { GroupOutlined, SearchOutlined } from '@mui/icons-material';

const People = () => {
  const allUsers = useQuery(api.relationship.getAllUsers);
  const [searchQuery, setSearchQuery] = useState('');

  if (allUsers === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  // Filter users based on search query
  const filteredUsers = allUsers?.filter((user: any) => 
    user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-purple-1 to-pink-1 rounded-full">
            <GroupOutlined sx={{ fontSize: "32px", color: "white" }} />
          </div>
          <h1 className="text-heading1-bold text-light-1">People</h1>
        </div>
        <p className="text-light-2 text-body-normal">
          Discover and connect with other users in the community
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-dark-2 rounded-xl p-4 border border-dark-1">
        <div className="relative">
          <SearchOutlined 
            sx={{ 
              position: "absolute", 
              left: "12px", 
              top: "50%", 
              transform: "translateY(-50%)", 
              color: "#626067",
              fontSize: "20px"
            }} 
          />
          <input
            type="text"
            placeholder="Search people by name or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-dark-1 border border-dark-2 rounded-lg text-light-1 text-body-normal focus:outline-none focus:border-purple-1 transition-colors"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="bg-dark-2 rounded-xl border border-dark-1 overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-8 text-center">
            <GroupOutlined sx={{ fontSize: "64px", color: "#626067", marginBottom: "16px" }} />
            <h3 className="text-light-1 text-heading4-bold mb-2">
              {searchQuery ? 'No users found' : 'No users available'}
            </h3>
            <p className="text-light-3 text-body-normal">
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'Be the first to join the community!'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-dark-1">
            {filteredUsers.map((user: any) => (
              <div key={user._id} className="p-4 hover:bg-dark-1 transition-colors duration-200">
                <UserCard userData={user} update={null} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      {filteredUsers.length > 0 && (
        <div className="text-center">
          <p className="text-light-3 text-small-semibold">
            Showing {filteredUsers.length} {filteredUsers.length === 1 ? 'person' : 'people'}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>
      )}
    </div>
  )
}

export default People