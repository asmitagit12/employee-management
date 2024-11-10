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

const TaskList = () => {
  const [allTasks, setAllTasks] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any | null>(null)
  const router = useRouter()
  useEffect(() => {
    const fetchItem = async () => {
      const response = await fetch(`/api/task/getall`, {
        method: 'GET'
      })

      const data = await response.json()
      console.log(data)
      setAllTasks(data)
    }
    fetchItem()
  }, [])

  const handleEdit = (id: string) => {
    // Handle edit action
    console.log('Edit task with ID:', id)
    router.push(`/task/${id}`)
  }

  const handleDelete = (data: any) => {
    // Handle delete action
    setOpen(true)
    setSelectedTask(data)
    console.log('Delete task with ID:', data)
  }

  const handleView = (id: string) => {
    // Handle view action
    console.log('View task with ID:', id)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const confirmDelete = async () => {
    const res = await fetch(`/api/task/delete/${selectedTask?.id}`, {
      method: 'DELETE'
    })

    if (res.ok) {
      setAllTasks(prevData =>
        prevData.filter(task => task?.id !== selectedTask.id)
      )
      toast({
        title: 'Success',
        description: 'Task deleted successfully'
      })
    } else {
      const errorData = await res.json()
      toast({
        title: 'Failed',
        description: errorData?.message || 'Error deleting task',
        variant: 'destructive'
      })
    }
    setOpen(false)
    setSelectedTask(null)
  }

  return (
    <>
      <div className='flex flex-col w-full gap-y-2'>
        <div className='w-full flex items-end justify-end flex-1'>
          <Link href={'/task/create'}>
            <Button>Create New Task</Button>
          </Link>
        </div>
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
              <TableHead>Assigned To</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead className='text-center'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allTasks.length > 0 ? (
              allTasks.map((task,index) => (
                <TableRow key={index}>
                  <TableCell className='font-medium'>
                    {index + 1}
                  </TableCell>
                  <TableCell>{task.taskno}</TableCell>
                  <TableCell className='font-medium'>
                    {task.title}
                  </TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>{new Date(task.duedate).toLocaleDateString('en-GB')}</TableCell>
                  <TableCell>
                    {task.priority}
                   
                  </TableCell>
                  <TableCell>{task.delayedby}</TableCell>
                  <TableCell>{task.assignedTo.fullName}</TableCell>
                  <TableCell>{task.createdBy.fullName}</TableCell>
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
                      <Button
                        variant='ghost'
                        className='p-2'
                        onClick={() => handleDelete(task)}
                      >
                        <Trash />
                      </Button>
                    </div>
                  </TableCell>
                  {/* <TableCell>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant='outline'
                          className='flex items-center justify-center'
                        >
                          <MoreHorizontal />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-28 h-auto p-1'>
                        <div className='flex flex-col items-start justify-start'>
                          <Button
                            variant='ghost'
                            className='flex items-center justify-around no-underline text-left w-full'
                            onClick={() => handleView(employee.id)}
                          >
                            <Eye />
                            <span style={{ textAlign: 'left' }}>View</span>
                          </Button>
                          <Separator />
                          <Button
                            variant='ghost'
                            className='flex items-center justify-around no-underline text-left w-full'
                            onClick={() => handleEdit(employee.id)}
                          >
                            <Pencil />
                            <span style={{ textAlign: 'left' }}>Edit</span>
                          </Button>
                          <Separator />
                          <Button
                            variant='ghost'
                            className='flex items-center justify-around no-underline text-left w-full'
                            onClick={() => handleDelete(employee)}
                          >
                            <Trash className='ml-1' />
                            <span>Delete</span>
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell> */}
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
      <DialogBox
        open={open}
        setClose={handleClose}
        title={'Delete Employee Details'}
        footer={
          <div className='mt-4 flex gap-2'>
            <Button variant={'ghost'} onClick={handleClose}>
              Cancel
            </Button>
            <Button variant={'ghost'} onClick={confirmDelete}>
              OK
            </Button>
          </div>
        }
      >
        <p>Are you sure you want to delete task details</p>
        <br />
       
      </DialogBox>
    </>
  )
}

export default TaskList
