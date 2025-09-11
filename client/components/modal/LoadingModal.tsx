'use client';

import React, { Fragment } from 'react'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { ClipLoader } from 'react-spinners';
import { PlayArrowOutlined, CloudUploadOutlined, VideoFileOutlined } from '@mui/icons-material';

interface LoadingModalProps {
  message: string;
}

const LoadingModal:React.FC<LoadingModalProps> = ({message}) => {
  const getIcon = () => {
    if (message.includes('upload') || message.includes('extracting')) {
      return <CloudUploadOutlined sx={{ fontSize: "32px", color: "#7857FF" }} />;
    } else if (message.includes('generating')) {
      return <VideoFileOutlined sx={{ fontSize: "32px", color: "#7857FF" }} />;
    }
    return <PlayArrowOutlined sx={{ fontSize: "32px", color: "#7857FF" }} />;
  };

  return (
    <Transition show as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div 
            className="
              fixed 
              inset-0 
              bg-dark-2/80 
              backdrop-blur-sm
              transition-opacity
            "
          />
        </TransitionChild>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div 
            className="
              flex 
              min-h-full 
              items-center 
              justify-center 
              p-4 
              text-center 
            "
          >
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel>
                <div className='bg-dark-1 border border-dark-2 rounded-xl p-8 min-w-[300px] max-w-md'>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      {getIcon()}
                      <div className="absolute -top-2 -right-2">
                        <ClipLoader size={20} color="#7857FF" />
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="text-heading4-bold text-light-1 mb-2">Processing...</h3>
                      <p className="text-light-2 text-small-semibold">{message}</p>
                    </div>
                    <div className="w-full bg-dark-2 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-1 to-pink-1 h-2 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default LoadingModal;