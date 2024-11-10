// import TitlePage from "@/components/custom/page-heading";

// const TaskList = () => {
//     return ( <div> <TitlePage title="Task's" description="All assigned task's" />User task list</div> );
// }

// export default TaskList;

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
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover'
import { Delete, Eye, MoreHorizontal, Pencil, Trash } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useRouter } from 'next/navigation'
import DialogBox from '@/components/custom/dialog-box'
import { toast } from '@/hooks/use-toast'
import TitlePage from '@/components/custom/page-heading'
import { useSession } from 'next-auth/react'

const TaskList = () => {
  const [allTasks, setAllTasks] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any | null>(null)
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user
  console.log('user', user)

  useEffect(() => {
    if (user) {
      console.log('Fetching tasks for user ID:', user.id) // Log the user ID

      const fetchTaskRecords = async () => {
        const response = await fetch(
          `/api/user-routes/task/getall/${user.id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        const data = await response.json()

        if (response.ok) {
          setAllTasks(data) // Assuming you have a state to hold the tasks
          console.log('Task Records:', data)
        } else {
          console.error('Error fetching tasks:', data.message || data.error)
        }
      }

      fetchTaskRecords()
    }
  }, [user])

  const handleEdit = (id: string) => {
    
    console.log('Edit task with ID:', id)
    router.push(`/users-pages/user-task/${id}`)
  }

 

  const handleView = (id: string) => {
    
    console.log('View task with ID:', id)
  }

 
 

  return (
    <>
      <div className='flex flex-col w-full gap-y-2'>
        <TitlePage title="Task's" description="All assigned task's" />
        <Table className='rounded border-slate-400'>
          <TableCaption>A list of your recent tasks.</TableCaption>
          <TableHeader>
            <TableRow className='bg-slate-100'>
              <TableHead className='w-[100px]'>Sr. No</TableHead>
              <TableHead>Task No</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Delayed By</TableHead>

              <TableHead>Created By</TableHead>
              <TableHead className='text-center'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allTasks.length > 0 ? (
              allTasks.map((task, index) => (
                <TableRow key={task.id}>
                  <TableCell className='font-medium'>{index + 1}</TableCell>
                  <TableCell>{task.taskno}</TableCell>
                  <TableCell className='font-medium'>{task.title}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>
                    {new Date(task.duedate).toLocaleDateString('en-GB')}
                  </TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>{task.delayedby}</TableCell>
                  <TableCell>{task?.createdBy?.firstName}</TableCell>
                  <TableCell className='flex items-center justify-center'>
                    <div className='flex space-x-2'>
                      <Button
                        variant='ghost'
                        className='p-2'
                        onClick={() => handleView(task.id)}
                      >
                        <Eye />
                      </Button>
                      <Button
                        variant='ghost'
                        className='p-2'
                        onClick={() => handleEdit(task.id)}
                      >
                        <Pencil />
                      </Button>
                     
                    </div>
                  </TableCell>
                 
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className='text-center'>
                  No tasks found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
     
    </>
  )
}

export default TaskList
