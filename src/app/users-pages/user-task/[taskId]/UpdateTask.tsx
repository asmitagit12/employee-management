// 'use client'
// import { InputController } from '@/components/custom/form.control/InputController'
// import TitlePage from '@/components/custom/page-heading'
// import { Button } from '@/components/ui/button'
// import { Form } from '@/components/ui/form'
// import { toast } from '@/hooks/use-toast'
// import { useSession } from 'next-auth/react'
// import { useEffect, useState } from 'react'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import * as z from 'zod'
// import { SelectController } from '@/components/custom/form.control/SelectController'
// import { DateController } from '@/components/custom/form.control/DateController'
// import { useParams, useRouter } from 'next/navigation'
// import { format, isValid, parseISO } from 'date-fns'
// import CommentsPage from '../_components/Comments'
// import { Input } from '@/components/ui/input'

// const formSchema = z.object({
//   status: z
//     .string({ required_error: 'Status is required' })
//     .min(1, 'Status is required')
// })

// type formType = z.infer<typeof formSchema>

// type EmployeeOption = {
//   label: string
//   value: string
// }
// export default function UpdateTask () {
//   const { data: session } = useSession()
//   const [employeeNames, setEmployeeNames] = useState<EmployeeOption[]>([])
//   const [loading, setLoading] = useState(false)
//   const [rowData, setRowData] = useState<any>(null)
//   const user = session?.user
//   const router = useRouter()
//   const params = useParams()

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       status: ''
//     }
//   })
//   useEffect(() => {
//     const fetchItem = async () => {
//       const response = await fetch(`/api/employee/getall`, {
//         method: 'GET'
//       })

//       const data = await response.json()
//       // Convert users into options format (label as full name, value as ID)
//       const userOptions: EmployeeOption[] = data.map(
//         (user: { firstName: string; lastName: string; id: string }) => ({
//           label: `${user.firstName} ${user.lastName}`,
//           value: user.id
//         })
//       )
//       setEmployeeNames(userOptions)
//     }
//     fetchItem()
//   }, [])

//   useEffect(() => {
//     if (params) {
//       const fetchItem = async () => {
//         const response = await fetch(`/api/user-routes/task/id`, {
//           method: 'POST',
//           body: JSON.stringify({ id: params.taskId })
//         })

//         const data = await response.json()

//         setRowData(data)
//         console.log('user data', data)
//         // Set form values after fetching data

//         form.setValue('status', data.status || '')
//       }

//       fetchItem()
//     }
//   }, [params])

//   const onSubmit = async (data: formType) => {
//     setLoading(true)

//     const payload = {
//       taskno: rowData.taskno,
//       ...data
//     }
//     const res = await fetch(`/api/task/update/${params?.taskId}`, {
//       // userId should be dynamically passed
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload)
//     })

//     setLoading(false)
//     if (res.ok) {
//       toast({
//         title: 'Success',
//         description: 'Task updated'
//       })
//       router.push('/users-pages/user-task')
//     } else {
//       const errorData = await res.json()
//       toast({
//         title: 'Failed',
//         description: errorData?.message || 'Error updating task',
//         variant: 'destructive'
//       })
//     }
//   }

//   // Options for priority and status
//   const priorityOptions = [
//     { label: 'High', value: 'high' },
//     { label: 'Medium', value: 'medium' },
//     { label: 'Low', value: 'low' }
//   ]

//   const statusOptions = [
//     { label: 'In Process', value: 'in_process' },
//     { label: 'Completed', value: 'completed' },
//     { label: 'Pending', value: 'pending' },
//     { label: 'Delayed', value: 'delayed' }
//   ]

//   return (
//     <>
//       <TitlePage
//         title={`Update Task - ${(rowData && rowData?.taskno) || ''}`}
//         description={'Update the task information'}
//       />

//       <div>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
//             <div className='grid gap-4 px-2'>
//               <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//                 <SelectController
//                   name='status'
//                   label='Status'
//                   placeholder='Select status'
//                   options={statusOptions}
//                   control={form.control}
//                 />
//               </div>
//               <div className='flex justify-end gap-x-2'>
//                 <Button
//                   type='button'
//                   onClick={() => {
//                     router.push('/task')
//                   }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button type='submit'>Save</Button>
//               </div>
//             </div>
//           </form>
//         </Form>
//         {rowData && <CommentsPage taskId={rowData.id} />}
//       </div>
//     </>
//   )
// }

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
import { useParams, useRouter } from 'next/navigation'
import CommentsPage from '../_components/Comments'

const formSchema = z.object({
  status: z
    .string({ required_error: 'Status is required' })
    .min(1, 'Status is required')
})

type formType = z.infer<typeof formSchema>

export default function UpdateTask () {
  const { data: session } = useSession()
  const [rowData, setRowData] = useState<any>(null)
  const user = session?.user
  const router = useRouter()
  const params = useParams()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: ''
    }
  })

  useEffect(() => {
    const fetchTaskDetails = async () => {
      const response = await fetch(`/api/user-routes/task/id`, {
        method: 'POST',
        body: JSON.stringify({ id: params.taskId })
      })

      const data = await response.json()
      setRowData(data)
      form.setValue('status', data.status || '')
    }

    fetchTaskDetails()
  }, [params])

  const onSubmit = async (data: formType) => {
    const payload = { ...data };
    const apiUrl = `/api/user-routes/task/update/${params?.taskId}`;
    console.log("API URL:", apiUrl); // Check the constructed URL
    const res = await fetch(apiUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  
    if (res.ok) {
      toast({ title: 'Success', description: 'Task updated' });
      setRowData((prev: any) => ({ ...prev, status: data.status }));
    } else {
      const errorData = await res.json();
      toast({
        title: 'Failed',
        description: errorData?.message || 'Error updating task',
        variant: 'destructive',
      });
    }
  };
  

  const statusOptions = [
    { label: 'In Process', value: 'in_process' },
    { label: 'Completed', value: 'completed' },
    { label: 'Pending', value: 'pending' },
    { label: 'Delayed', value: 'delayed' }
  ]

  return (
    <div className='p-6 bg-gray-50 rounded-lg'>
      <TitlePage
        title={`Update Task - ${rowData?.taskno || ''}`}
        description='Update the task information'
      />

      {rowData && (
        <div className='bg-white p-6 rounded-lg shadow-md mb-6 mt-4'>
          <h2 className='text-xl font-semibold mb-4'>Task Details</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 capitalize'>
            <p>
              <strong>Title:</strong> {rowData.title}
            </p>
            <p>
              <strong>Description:</strong> {rowData.description}
            </p>
            <p>
              <strong>Assigned To:</strong> {rowData.assignedTo?.firstName}{' '}
              {rowData.assignedTo?.lastName}
            </p>
            <p>
              <strong>Created By:</strong> {rowData.createdBy?.firstName}{' '}
              {rowData.createdBy?.lastName}
            </p>
            <p>
              <strong>Due Date:</strong>{' '}
              {new Date(rowData.duedate).toLocaleDateString()}
            </p>
            <p>
              <strong>Project:</strong> {rowData.projectname}
            </p>

            {/* Priority Chip */}
            <p className='flex items-center'>
              <strong>Priority:</strong>
              <span
                className={`ml-2 px-2 py-1 rounded-full text-white font-semibold ${
                  rowData.priority === 'high'
                    ? 'bg-red-500'
                    : rowData.priority === 'medium'
                    ? 'bg-yellow-500'
                    : rowData.priority === 'low'
                    ? 'bg-green-500'
                    : 'bg-gray-500'
                }`}
              >
                {rowData.priority}
              </span>
            </p>

            {/* Status Chip */}
            <p className='flex items-center'>
              <strong>Status:</strong>
              <span
                className={`ml-2 px-2 py-1 rounded-full text-white font-semibold ${
                  rowData.status === 'in-progress'
                    ? 'bg-blue-500'
                    : rowData.status === 'completed'
                    ? 'bg-green-500'
                    : rowData.status === 'pending'
                    ? 'bg-orange-500'
                    : 'bg-gray-500'
                }`}
              >
                {rowData.status}
              </span>
            </p>
          </div>
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='bg-white p-6 rounded-lg shadow-md mb-2'
        >
          <h2 className='text-xl font-semibold mb-4'>Update Task Status</h2>
          <SelectController
            name='status'
            label='Status'
            placeholder='Select status'
            options={statusOptions}
            control={form.control}
          />
          <div className='flex justify-end mt-4 gap-2'>
            <Button onClick={() => router.push('/users-pages/user-task')} variant='secondary'>
              Cancel
            </Button>
            <Button type='submit'>Save</Button>
          </div>
        </form>
      </Form>

      {rowData && <CommentsPage taskId={rowData.id} />}
    </div>
  )
}
