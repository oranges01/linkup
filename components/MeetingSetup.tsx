import { DeviceSettings, useCall, VideoPreview } from '@stream-io/video-react-sdk';
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';

const MeetingSetup = ({setIsSetupComplete}: {setIsSetupComplete: (value: boolean) => void}) => {
  const [isMicCamToggleOn, setIsMicCamToggleOn] = useState(false);

  const call = useCall();

  if (!call) {
    throw new Error('useCall must be used within a StreamCallProvider');
  }

  useEffect(() => {
    if (isMicCamToggleOn) {
      call?.camera.disable();
      call?.microphone.disable();
    } else {
      call?.camera.enable();
      call?.microphone.enable();
    }
  }, [isMicCamToggleOn, call?.camera, call?.microphone])

  return (
    <div  className='flex h-screen w-full flex-col justify-center items-center gap-3 text-white'>
      <h1 className='text-2xl font-bold'>Meeting Setup</h1>
      <VideoPreview />
      <div className='flex h-16 items-center justify-center gap-3'>
        <label className='flex items-center justify-center gap-2 font-medium'>
          <input 
            type="checkbox"
            checked={isMicCamToggleOn}
            onChange={() => setIsMicCamToggleOn(!isMicCamToggleOn)}
          />
          Join with Mic and Cam
        </label>
        <DeviceSettings />
      </div>
      <Button 
        className='bg-green-500 hover:bg-green-700 rounded-md px-4 py-2.5'
        onClick={() => {
          call?.join();
          setIsSetupComplete(true);
        }}
      >
        Join Meeting
      </Button>

    </div>
  )
}

export default MeetingSetup