import { CallControls, CallingState, CallParticipantsList, CallStatsButton, PaginatedGridLayout, SpeakerLayout, useCallStateHooks } from '@stream-io/video-react-sdk'
import React, { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutList, Users } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import EndCallButton from './EndCallButton'
import Loader from './Loader'


type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right' 

const MeetingRoom = () => {

  // 个人房间(非主持人)
  const searchParams = useSearchParams()
  const isPersonalRoom = !!searchParams.get('personal')
  console.log('isPersonalRoom', isPersonalRoom)

  // 管理当前speaker的布局状态
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left')

  // 管理当前的参会者列表
  const [showParticipants, setShowParticipants] = useState(false)

  // 设获取call呼叫状态(正在呼叫中，显示loader)
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  if (callingState !== CallingState.JOINED) return <Loader />;


  const CallLayout = () => {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout />
      case'speaker-right':
        return <SpeakerLayout participantsBarPosition='left' />
      default:
        return <SpeakerLayout participantsBarPosition='right' />
    }
  }

  return (
    <section className='relative h-screen w-full overflow-hidden pt-4 text-white'>
      <div className='relative flex size-full items-center justify-center'>
        {/* 主持人和参与者视频框或头像框的布局 */}
        <CallLayout />
        {/* 参会者列表 */}
        {showParticipants && (
          <div className={'h-[calc(100vh-86px)] ml-2'}>
            <CallParticipantsList onClose={() => setShowParticipants(false)} />
          </div>
        )}
      </div>
      <div className='fixed bottom-0 left-0 flex w-full items-center justify-center gap-5 flex-wrap'>
        {/* 控制按钮 */}
        <CallControls />
        {/* 布局切换按钮 */}
        <DropdownMenu>
          <div className='flex items-center'>
            <DropdownMenuTrigger className='cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]'>
              <LayoutList size={20} className='text-white' />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className='border-dark-1 bg-dark-1 text-white'>
            {['Grid','Speaker-left','Speaker-right'].map((item, index) => (
              <div key={index}>
                <DropdownMenuItem onClick={() => setLayout(item.toLowerCase() as CallLayoutType)}>
                  {item}
                </DropdownMenuItem>
                <DropdownMenuSeparator className='bg-dark-1' />
              </div>
            ))}

          </DropdownMenuContent>
        </DropdownMenu>
        {/* 会议室连接状态 */}
        <CallStatsButton />
        {/* 参会者列表按钮 */}
        <button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className='cursor-pointee rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]'>
            <Users size={20} className='text-white' />
          </div>
        </button>
        {/* 结束会议按钮 */}
        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  )
}

export default MeetingRoom