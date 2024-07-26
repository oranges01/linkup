import { PaginatedGridLayout, SpeakerLayout } from '@stream-io/video-react-sdk'
import React, { useState } from 'react'

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right' 

const MeetingRoom = () => {

  // 管理当前speaker的布局状态
  const [layout, setLayout] = useState('speaker-left')

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
    <div className='text-white'>MeetingRoom</div>
  )
}

export default MeetingRoom