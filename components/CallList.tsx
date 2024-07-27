'use client'

import { useGetCalls } from "@/hooks/useGetCalls"
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import MeetingCard from "./MeetingCard";
import { Loader } from "lucide-react";
import { useToast } from "./ui/use-toast";

export const CallList = ({type} : {type: 'ended' | 'upcoming' | 'recordings'}) => {
  const router = useRouter();

  const {toast} = useToast();

  // 通过自定义的hooks获取calls记录
  const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls();

  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  // 根据type获取对应的calls
  const getCalls = () => {
    switch (type) {
      case 'ended':
        return endedCalls;
      case 'recordings':
        return recordings;
      case 'upcoming':
        return upcomingCalls;
      default:
        return [];
    }
  };

  // 根据type获取对应的no calls message
  const getNoCallsMessage = () => {
    switch (type) {
      case 'ended':
        return 'No Previous Calls';
      case 'upcoming':
        return 'No Upcoming Calls';
      case 'recordings':
        return 'No Recordings';
      default:
        return '';
    }
  };

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const callData = await Promise.all(callRecordings?.map((meeting) => meeting.queryRecordings()) ?? []);

        const recordings = callData.filter(call => call.recordings.length > 0).flatMap(call => call.recordings)

        setRecordings(recordings)
      } catch (error) {
        toast({title: 'Try again later'})
      }
    }

    if (type ==='recordings') {
      fetchRecordings()
    }
  }, [type,callRecordings])

  if (isLoading) return <Loader />

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();


  // recordings记录是历史会议，有url， call是还未进行的会议，没有url，有id
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2" >
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => (
          <MeetingCard 
            key={(meeting as Call).id}
            icon={type === 'ended' ? '/icons/previous.svg' : type === 'upcoming'? '/icons/upcoming.svg' : '/icons/recordings.svg'}
            title={(meeting as Call).state?.custom?.description || (meeting as CallRecording).filename?.substring(0, 20) || 'No description'}
            date={(meeting as Call).state?.startsAt?.toLocaleString() || (meeting as CallRecording).start_time.toLocaleString()}
            isPreviousMeeting={type === 'ended'}
            buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
            buttonText={type === 'recordings' ? 'Play' : 'Start'}
            handleClick={type ==='recordings'? () => router.push(`${(meeting as CallRecording).url}`) : () => router.push(`/meeting/${(meeting as Call).id}`)}
            link={type === 'recordings' ? (meeting as CallRecording).url : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}?join=${(meeting as Call).id}`}
          />
        ))
      ) : (
        <h1>{noCallsMessage}</h1>
      )}
    </div>
  )
}

export default CallList;
