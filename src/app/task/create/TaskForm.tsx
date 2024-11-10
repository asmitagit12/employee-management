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
import { useRouter } from 'next/navigation'
import { useMounted } from '@/hooks/use-mounted'
import { DateController } from '@/components/custom/form.control/DateController'
import { SelectController } from '@/components/custom/form.control/SelectController'


// Define validation schema using zod
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
  duedate: z
    .string({ required_error: 'Due Date is required' })
    .min(1, 'Due Date is required'),
  projectname: z
    .string({ required_error: 'projectname is required' })
    .min(1, 'projectname is required')
})

// Infer the form type from zod schema
type formType = z.infer<typeof formSchema>

const TaskForm = () => {
  const router = useRouter()
  const mounted = useMounted()
  const [loading, setLoading] = useState(false)
  const [employeeNames, setEmplyeeNames] = useState([])
  const { data: session } = useSession()
  const user = session?.user

  useEffect(() => {
    const fetchItem = async () => {
      const response = await fetch(`/api/employee/getall`, {
        method: 'GET'
      })

      const data = await response.json()
      console.log(data)
      // Convert users into options format (label as full name, value as ID)
      const userOptions = data.map((user: { firstName: any; lastName: any; id: any }) => ({
        label: `${user.firstName} ${user.lastName}`,
        value: user.id
      }))
      setEmplyeeNames(userOptions)
    }
    fetchItem()
  }, [])

  // Initialize react-hook-form with zod resolver
  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      assignedTo: '',
      duedate: '',
      projectname: ''
    }
  })

  // Form submission handler
  const onSubmit = async (data: formType) => {
    setLoading(true)

    const res = await fetch('/api/task/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    setLoading(false)
    if (res.ok) {
      toast({
        title: 'Success',
        description: 'task created'
      })
      router.push('/task')
    } else {
      const errorData = await res.json()
      toast({
        title: 'Failed',
        description: errorData?.message || 'Error creating task',
        variant: 'destructive'
      })
    }
  }



  return (
    <>
      <TitlePage
        title={'Create Task'}
        description={'Fill the information about new task'}
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
                  // description="Please select the employee to assign the task."
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
              </div>
              <div className='flex justify-end gap-x-2'>
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
      </div>
    </>
  )
}

export default TaskForm
