'use client'
import TitlePage from '@/components/custom/page-heading'
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
import { Eye, Pencil, Trash } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const LeaveList = () => {
  const [allLeaveData, setAllLeaves] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchItem = async () => {
      const response = await fetch(`/api/leave/getall`, {
        method: 'GET'
      })

      const data = await response.json()
      console.log('leaves', data)
      setAllLeaves(data)
    }
    fetchItem()
  }, [])

  const handleEdit = (id: string) => {
      
      router.push(`/leave/${id}`)
    console.log('Edit leave with ID:', id)
  }

  const handleView = (id: string) => {
    console.log('View leave with ID:', id)
  }

  const handleDelete = (data: any) => {
    console.log('Delete leave with ID:', data)
  }

  return (
    <div className='flex flex-col w-full gap-y-2'>
      <TitlePage title="Leave's" description="All Leave's" />
      <div className='w-full flex items-end justify-end flex-1'>
        {/* <Link href={'/employee/create'}>
            <Button>Add Employee</Button>
          </Link> */}
      </div>
      <Table className='rounded border-slate-400'>
        <TableCaption>A list of leaves.</TableCaption>
        <TableHeader>
          <TableRow className='bg-slate-100'>
            <TableHead className='w-[100px]'>Sr. No</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Present</TableHead>
            <TableHead>Time In</TableHead>
            <TableHead>Time Out</TableHead>
            <TableHead>Total Hourse</TableHead>
            <TableHead>Leave Type</TableHead>
            <TableHead>Leave Reason</TableHead>
            {/* <TableHead>Updated At</TableHead> */}
            <TableHead className='text-center'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allLeaveData.length > 0 ? (
            allLeaveData.map((leave, index) => (
              <TableRow key={leave.id}>
                <TableCell className='font-medium'>{index + 1}</TableCell>
                <TableCell>
                  {new Date(leave.startDate).toLocaleDateString('en-GB')}
                </TableCell>
                <TableCell>
                  {new Date(leave.endDate).toLocaleDateString('en-GB')}
                </TableCell>
                <TableCell>{`${leave?.user?.firstName} ${leave?.user?.lastName}`}</TableCell>
                <TableCell>{leave.present ? 'Present' : 'Absent'}</TableCell>
                <TableCell>{leave.timeIn || '-'}</TableCell>
                <TableCell>{leave.timeOut || '-'}</TableCell>
                <TableCell>{leave.totalHours || '-'}</TableCell>
                <TableCell>{leave.leaveType || '-'}</TableCell>
                <TableCell>{leave.leaveReason || '-'}</TableCell>
                <TableCell className='flex items-center justify-center'>
                  <div className='flex space-x-2'>
                    <Button
                      variant='ghost'
                      className='p-2'
                      onClick={() => handleView(leave.id)}
                    >
                      <Eye />
                    </Button>
                    <Button
                      variant='ghost'
                      className='p-2'
                      onClick={() => handleEdit(leave.id)}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant='ghost'
                      className='p-2'
                      onClick={() => handleDelete(leave)}
                    >
                      <Trash />
                    </Button>
                  </div>
                </TableCell>
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

export default LeaveList
