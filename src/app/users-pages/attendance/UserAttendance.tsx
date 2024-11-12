'use client'
import TitlePage from '@/components/custom/page-heading'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Switch } from '@/components/ui/switch'
import { Label } from "@/components/ui/label"


const AttendanceList = () => {
  const [allAttendance, setAllAttendance] = useState<any[]>([])
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user
  console.log('user', user)

  useEffect(() => {
    if (user) {
      const fetchAttendanceRecords = async () => {
        const response = await fetch(
          `/api/user-routes/attendance/getall/${user.id}`,
          {
            // Update to use GET and pass userId in URL
            method: 'GET', // Change to GET
            headers: {
              'Content-Type': 'application/json' // Optional since GET typically doesn't send a body
            }
          }
        )

        const data = await response.json()

        if (response.ok) {
          setAllAttendance(data) // Assuming you have a state to hold the attendance records
          console.log('Attendance Records:', data)
        } else {
          console.error('Error fetching attendance:', data.message)
        }
      }
      fetchAttendanceRecords()
    }
  }, [user])

  const handleCheckIn = async () => {
    if (user) {
      try {
        const response = await fetch(`/api/user-routes/attendance/checkin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId: user.id })
        })

        if (response.ok) {
          const data = await response.json()
          console.log('Check-in successful:', data)

          if (data) {
            // Append the new record to the existing attendance list
            setAllAttendance(prev => {
              console.log('Previous Attendance:', prev) // Log the previous state
              return [...prev, data.attendance]
            })
          }
        } else {
          console.error('Failed to check in.')
        }
      } catch (error) {
        console.error('Error during check-in:', error)
      }
    }
  }

  const handleCheckOut = async (attendanceId: string) => {
    if (user) {
      try {
        const response = await fetch(`/api/user-routes/attendance/check-out`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId: user.id, attendanceId })
        })

        if (response.ok) {
          const data = await response.json()
          console.log('Check-out successful:', data)

          // Update the attendance list with the checked-out record
          setAllAttendance(prev =>
            prev.map(attendance =>
              attendance.id === attendanceId
                ? { ...attendance, ...data.attendance }
                : attendance
            )
          )
        } else {
          console.error('Failed to check out.')
        }
      } catch (error) {
        console.error('Error during check-out:', error)
      }
    }
  }

  const handleLeaveClick = () => {
    router.push(`/users-pages/attendance/leave`)
  }

  return (
    <div>
      <TitlePage title='Attendace' description='Your attendance list' />
      <div className='space-y-2'>
        <div className='flex justify-end space-x-2 mt-2'>
          {/* <div className='flex space-x-2'>
            <Button onClick={handleLeaveClick}>Apply Leave</Button>
            <div className='flex items-center space-x-2'>
              <Switch id='airplane-mode' />
              <Label htmlFor='airplane-mode'>Airplane Mode</Label>
            </div>
          </div> */}
          <div className='flex space-x-2'>
            <Button onClick={handleCheckIn}>Check In</Button>
            <Button onClick={() => handleCheckOut(allAttendance[0]?.id)}>
              Check Out
            </Button>
          </div>
        </div>
        <Table className='rounded border-slate-400'>
          <TableCaption>A list of attendance.</TableCaption>
          <TableHeader>
            <TableRow className='bg-slate-100'>
              <TableHead className='w-[100px]'>Sr. No</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Present</TableHead>
              <TableHead>Time In</TableHead>
              <TableHead>Time Out</TableHead>
              <TableHead>Total Hourse</TableHead>
              <TableHead>Leave Type</TableHead>
              <TableHead>Leave Reason</TableHead>
              {/* <TableHead>Updated At</TableHead> */}
              {/* <TableHead className='text-center'>Actions</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {allAttendance.length > 0 ? (
              allAttendance.map((attendance, index) => (
                <TableRow key={attendance.id}>
                  <TableCell className='font-medium'>{index + 1}</TableCell>
                  <TableCell>{attendance.date}</TableCell>
                  <TableCell>
                    {attendance.present ? 'Present' : 'Absent'}
                  </TableCell>
                  <TableCell>{attendance.timeIn || '-'}</TableCell>
                  <TableCell>{attendance.timeOut || '-'}</TableCell>
                  <TableCell>{attendance.totalHours || '-'}</TableCell>
                  <TableCell>{attendance.leaveType || '-'}</TableCell>
                  <TableCell>{attendance.leaveReason || '-'}</TableCell>
                  {/* <TableCell>
                    {' '}
                    {new Date(attendance.updatedAt).toLocaleDateString('en-GB')}
                  </TableCell> */}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className='text-center'>
                  No attendance records found for this user
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default AttendanceList
