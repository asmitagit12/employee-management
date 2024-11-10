'use client'
import { InputController } from '@/components/custom/form.control/InputController'
import TitlePage from '@/components/custom/page-heading'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { toast } from '@/hooks/use-toast'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { SelectController } from '@/components/custom/form.control/SelectController'
import { DateController } from '@/components/custom/form.control/DateController'
import { useParams, useRouter } from 'next/navigation'
import { format, isValid, parseISO } from 'date-fns'
import CommentsPage from '../_components/Comments'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, 'Title is required'),
  description: z
    .string({ required_error: 'Description is required' })
    .min(1, 'Description is required'),
  assignedTo: z
    .string({ required_error: 'Emplyee Name is required' })
    .min(1, 'Emplyee Name is required'),
  priority: z
    .string({ required_error: 'Priority is required' })
    .min(1, 'Priority is required'),
  status: z
    .string({ required_error: 'Status is required' })
    .min(1, 'Status is required'),
  duedate: z
    .string({ required_error: 'Due Date is required' })
    .min(1, 'Due Date is required'),
  projectname: z
    .string({ required_error: 'projectname is required' })
    .min(1, 'projectname is required')
})

type formType = z.infer<typeof formSchema>

type EmployeeOption = {
  label: string
  value: string
}
export default function UpdateTask () {
  const { data: session } = useSession()
  const [employeeNames, setEmployeeNames] = useState<EmployeeOption[]>([])
  const [loading, setLoading] = useState(false)
  const [rowData, setRowData] = useState<any>(null)
  const user = session?.user
  const router = useRouter()
  const params = useParams()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      assignedTo: '',
      duedate: '',
      priority: '',
      projectname: '',
      status: ''
    }
  })
  useEffect(() => {
    const fetchItem = async () => {
      const response = await fetch(`/api/employee/getall`, {
        method: 'GET'
      })

      const data = await response.json()
      // Convert users into options format (label as full name, value as ID)
      const userOptions: EmployeeOption[] = data.map(
        (user: { firstName: string; lastName: string; id: string }) => ({
          label: `${user.firstName} ${user.lastName}`,
          value: user.id
        })
      )
      setEmployeeNames(userOptions)
    }
    fetchItem()
  }, [])

  useEffect(() => {
    if (params) {
      const fetchItem = async () => {
        const response = await fetch(`/api/task/id`, {
          method: 'POST',
          body: JSON.stringify({ id: params.taskId })
        })

        const data = await response.json()

        setRowData(data)

        // Set form values after fetching data
        form.setValue('title', data.title || '')
        form.setValue('description', data.description || '')
        form.setValue('projectname', data.projectname || '')
        form.setValue('assignedTo', data.assignedTo?.id || '')
        form.setValue('status', data.status || '')
        form.setValue('priority', data.priority || '')

        const dueDateValue = data.duedate ? new Date(data.duedate) : null

        // Use a type guard to ensure `form.setValue` gets a string when dueDateValue is a valid Date
        // form.setValue('duedate', dueDateValue ? format(dueDateValue, 'dd-MM-yyyy') : ''); // Convert to ISO or fallback to an empty string
        form.setValue('duedate', dueDateValue ? dueDateValue.toISOString() : '') // Convert to ISO or fallback to an empty string

        // form.setValue('duedate', formattedDueDate)
      }

      fetchItem()
    }
  }, [params])

  const onSubmit = async (data: formType) => {
    setLoading(true)

    const payload = {
      taskno: rowData.taskno,
      ...data
    }
    const res = await fetch(`/api/task/update/${params?.taskId}`, {
      // userId should be dynamically passed
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    setLoading(false)
    if (res.ok) {
      toast({
        title: 'Success',
        description: 'Task updated'
      })
      // router.push('/task')
    } else {
      const errorData = await res.json()
      toast({
        title: 'Failed',
        description: errorData?.message || 'Error updating task',
        variant: 'destructive'
      })
    }
  }

  // Options for priority and status
  const priorityOptions = [
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' }
  ]

  const statusOptions = [
    { label: 'In Process', value: 'in_process' },
    { label: 'Completed', value: 'completed' },
    { label: 'Pending', value: 'pending' },
    { label: 'Delayed', value: 'delayed' }
  ]

  return (
    <>
 

      <TitlePage
        title={`Update Task - ${(rowData && rowData?.taskno) || ''}`}
        description={'Update the task information'}
      />
      
  
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid gap-4 px-2'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Input controllers for form fields */}
                <InputController
                  name='title'
                  label='Title'
                  placeholder='Title'
                  maxLength={50}
                  control={form.control}
                />
                <InputController
                  name='description'
                  label='Description'
                  placeholder='Description'
                  maxLength={50}
                  control={form.control}
                />
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <SelectController
                  name='assignedTo'
                  label='Assigned To'
                  placeholder='Select a employee name'
                  //   defaultValue={employeeNames.find((option) => option.value === form.getValues('assignedTo'))?.value}

                  options={employeeNames}
                  control={form.control}
                />
                <DateController
                  name='duedate'
                  label='Due Date'
                  placeholder='Due Date'
                  control={form.control}
                />
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <InputController
                  name='projectname'
                  label='Project Name'
                  placeholder='Project Name'
                  maxLength={40}
                  control={form.control}
                />
                <SelectController
                  name='priority'
                  label='Priority'
                  placeholder='Select priority'
                  options={priorityOptions}
                  control={form.control}
                />
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <SelectController
                  name='status'
                  label='Status'
                  placeholder='Select status'
                  options={statusOptions}
                  control={form.control}
                />
              </div>
              <div className='flex justify-end gap-x-2'>
                <Button variant='outline' type='button'
                  onClick={() => {
                    router.push('/task')
                  }}>Back</Button>
                <Button
                  type='button'
                  onClick={() => {
                    router.push('/task')
                  }}
                >
                  Cancel
                </Button>
                <Button type='submit'>Save</Button>
              </div>
            </div>
          </form>
        </Form>
        {rowData && <CommentsPage taskId={rowData.id} />}
      </div>
    </>
  )
}
