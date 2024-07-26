"use client"

import React, { useState } from 'react'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation';
import MeetingModal from './MeetingModal';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';
import { useToast } from "@/components/ui/use-toast"


const MeetingTypeList = () => {
  const router = useRouter()
  const [meetingState, setMeetingState] = useState<'isJoiningMeeting' | 'isScheduleMeeting' | 'isInstantMeeting' | undefined>()
  const { user } = useUser();
  const client = useStreamVideoClient();
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: '',
    link: '',
  })
  const [callDetails, setcallDetails] = useState<Call>();
  const { toast } = useToast()

  const createMeeting = async () => {
    if (!user || !client) return;
    
    try {
      // 预约会议需要选择日期和时间
      if (!values.dateTime) {
        toast({title: 'Please select a date and time'})
        return;
      }
      // 创建call
      const id = crypto.randomUUID();
      const call = client.call('default', id);

      if (!call) throw new Error('Failed to create call');

      const startAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || 'Instant meeting';

      // 有可能是创建会议，也有可能是加入会议
      await call.getOrCreate({
        data: {
          starts_at: startAt,
          custom: {
            description
          }
        }
      })

      setcallDetails(call);

      // 如果没有提供会议描述，则直接进入会议
      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }

      toast({title: 'Meeting created successfully'})
    } catch (error) {
      console.error(error);
      toast({title: 'Failed to create meeting'})
    }
    
  }

  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
      <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        className="bg-orange-1"
        handleClick={() => setMeetingState('isInstantMeeting')}
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="via invitation link"
        className="bg-blue-1"
        handleClick={() => setMeetingState('isJoiningMeeting')}
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        className="bg-purple-1"
        handleClick={() => setMeetingState('isScheduleMeeting')}
      />
      <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Meeting Recordings"
        className="bg-yellow-1"
        handleClick={() => router.push('/recordings')}
      />

      <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="New Instant Meeting"
        className="text-center"
        handleClick={() => createMeeting()}
        buttonText="Start"    
        />
    </section>
  )
}

export default MeetingTypeList