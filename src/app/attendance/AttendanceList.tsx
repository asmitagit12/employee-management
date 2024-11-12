'use client'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const AttendanceList = () => {
  const [attendanceData, setAllAttendance] = useState<any[]>([])

  useEffect(() => {
    const fetchItem = async () => {
      const response = await fetch(`/api/attendance/getall`, {
        method: 'GET'
      })

      const data = await response.json()
      console.log(data)
      setAllAttendance(data)
    }
    fetchItem()
  }, [])
  return (
    <div className='flex flex-col w-full gap-y-2'>
      <div className='w-full flex items-end justify-end flex-1'>
        {/* <Link href={'/employee/create'}>
            <Button>Add Employee</Button>
          </Link> */}
      </div>
      <Table className='rounded border-slate-400'>
        <TableCaption>A list of attendance.</TableCaption>
        <TableHeader>
          <TableRow className='bg-slate-100'>
            <TableHead className='w-[100px]'>Sr. No</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Full Name</TableHead>
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
          {attendanceData.length > 0 ? (
            attendanceData.map((attendance, index) => (
              <TableRow key={attendance.id}>
                <TableCell className='font-medium'>{index + 1}</TableCell>
                <TableCell>{attendance.date}</TableCell>
                <TableCell>{`${attendance?.user?.firstName} ${attendance?.user?.lastName}`}</TableCell>
                <TableCell>
                  {attendance.present ? 'Present' : 'Absent'}
                </TableCell>
                <TableCell>{attendance.timeIn || '-'}</TableCell>
                <TableCell>{attendance.timeOut || '-'}</TableCell>
                <TableCell>{attendance.totalHours || '-'}</TableCell>
                <TableCell>{attendance.leaveType || '-'}</TableCell>
                <TableCell>{attendance.leaveReason || '-'}</TableCell>
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
  )
}

export default AttendanceList
