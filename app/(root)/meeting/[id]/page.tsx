"use client"

import Loader from '@/components/Loader'
import MeetingRoom from '@/components/MeetingRoom'
import MeetingSetup from '@/components/MeetingSetup'
import { useGetCallById } from '@/hooks/useGetCallById'
import { useUser } from '@clerk/nextjs'
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk'
import React, { useState } from 'react'

const Meeting = ({ params }: { params: { id: string } }) => {
  const { user, isLoaded } = useUser();

  // 表示是否完成了会议设置（包括摄像头、声音等）
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  // 表示是否获取到call（通话会话的实例，包含了通话的状态和控制逻辑，允许你管理和操作通话的各个方面）
  const { call, isCallLoading } = useGetCallById(params.id);

  if (!isLoaded || isCallLoading) return <Loader />;

  if (!call) return (
    <p className="text-center text-3xl font-bold text-white">
      Call Not Found
    </p>
  );

    // get more info about custom call type:  https://getstream.io/video/docs/react/guides/configuring-call-types/
    // const notAllowed = call.type === 'invited' && (!user || !call.state.members.find((m) => m.user.id === user.id));

    // if (notAllowed) return <Alert title="You are not allowed to join this meeting" />;
  

  return (
    <main>
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? 
            (<MeetingSetup setIsSetupComplete={setIsSetupComplete}/>) : 
            (<MeetingRoom />)
          }
        </StreamTheme>
      </StreamCall>
    </main>
  )
}

export default Meeting