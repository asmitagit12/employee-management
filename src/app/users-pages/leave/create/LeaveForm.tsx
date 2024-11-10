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
  leaveType: z
    .string({ required_error: 'Leave Type is required' })
    .min(1, 'Leave Type is required'),
  leaveReason: z
    .string({ required_error: 'Leave Reason is required' })
    .min(1, 'Leave Reason is required'),
  startDate: z
    .string({ required_error: 'Start Date is required' })
    .min(1, 'Emplyee Name is required'),
  endDate: z
    .string({ required_error: 'End Date is required' })
    .min(1, 'End Date is required')
})

// Infer the form type from zod schema
type formType = z.infer<typeof formSchema>

const LeaveForm = () => {
  const router = useRouter()
  const mounted = useMounted()
  const [loading, setLoading] = useState(false)
  const [employeeNames, setEmplyeeNames] = useState([])
  const { data: session } = useSession()
  const user = session?.user

  // Initialize react-hook-form with zod resolver
  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      leaveType: '',
      leaveReason: '',
      startDate: '',
      endDate: ''
    }
  })

  // Form submission handler
  const onSubmit = async (data: formType) => {
    setLoading(true)

    const res = await fetch('/api/user-routes/leave/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    setLoading(false)
    if (res.ok) {
      toast({
        title: 'Success',
        description: 'Leave Application Sent'
      })
      router.push('/users-pages/leave')
    } else {
      const errorData = await res.json()
      toast({
        title: 'Failed',
        description: errorData?.message || 'Error at apply leave',
        variant: 'destructive'
      })
    }
  }

  const leaveTypeOptions = [
    { label: 'Sick Leave', value: 'SICK_LEAVE' },
    { label: 'Casual Leave', value: 'CASUAL_LEAVE' },
    { label: 'Emergency Leave', value: 'EMERGENCY_LEAVE' },
    { label: 'Holiday', value: 'HOLIDAY' },
    { label: 'Half Day', value: 'HALF_DAY' }
  ]

  return (
    <>
      <TitlePage
        title={'Apply Leave'}
        description={'Fill the information about new task'}
      />
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid gap-4 px-2'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Input controllers for form fields */}
                <SelectController
                  name='leaveType'
                  label='Leave Type'
                  placeholder='Select a leave type'
                  options={leaveTypeOptions} // Use the manual array here
                  control={form.control}
                />
                <InputController
                  name='leaveReason'
                  label='Leave Reason'
                  placeholder='Leave Reason'
                  maxLength={50}
                  control={form.control}
                />
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <DateController
                  name='startDate'
                  label='From'
                  placeholder='Start Date'
                  control={form.control}
                />
                <DateController
                  name='endDate'
                  label='To'
                  placeholder='End Date'
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
                <Button type='submit'>Apply</Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}

export default LeaveForm
