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

// Define validation schema using zod
const formSchema = z.object({
  firstName: z
    .string({ required_error: 'First Name is required' })
    .min(1, 'First Name is required'),
  lastName: z
    .string({ required_error: 'Last Name is required' })
    .min(1, 'Last Name is required'),
  designation: z
    .string({ required_error: 'Designation is required' })
    .min(1, 'Designation is required'),
  mobile: z
    .string({ required_error: 'Mobile number is required' })
    .min(10, 'Mobile number must be exactly 10 digits')
    .max(10, 'Mobile number must be exactly 10 digits') // Adjust as per format
    .regex(/^\d+$/, 'Mobile number must contain only digits'), // Ensure digits only
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email')
})

// Infer the form type from zod schema
type formType = z.infer<typeof formSchema>

const EmployeeForm = () => {
  const router = useRouter()
  const mounted = useMounted()
  const [loading, setLoading] = useState(false)

  const { data: session } = useSession()
  const user = session?.user

  // Initialize react-hook-form with zod resolver
  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      designation: ''
    }
  })

  // Form submission handler
  const onSubmit = async (data: formType) => {
    setLoading(true)

    const res = await fetch('/api/employee/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    setLoading(false)
    if (res.ok) {
      toast({
        title: 'Success',
        description: 'Employee created'
      })
      router.push('/employee')
    } else {
      const errorData = await res.json()
      toast({
        title: 'Failed',
        description: errorData?.message || 'Error creating employee',
        variant: 'destructive'
      })
    }
  }

  return (
    <>
      <TitlePage
        title={'Create Employee'}
        description={'Fill the information about new employee'}
      />
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid gap-4 px-2'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Input controllers for form fields */}
                <InputController
                  name='firstName'
                  label='First Name'
                  placeholder='First Name'
                  maxLength={50}
                  control={form.control}
                />
                <InputController
                  name='lastName'
                  label='Last Name'
                  placeholder='Last Name'
                  maxLength={50}
                  control={form.control}
                />
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <InputController
                  name='email'
                  label='Email Id'
                  placeholder='Email'
                  type='email'
                  maxLength={40}
                  control={form.control}
                />
                <InputController
                  name='mobile'
                  label='Mobile No.'
                  placeholder='Mobile'
                  maxLength={10}
                  type='tel' // Set the input type to 'tel' or 'number'
                  control={form.control}
                />
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <InputController
                  name='designation'
                  label='Designation'
                  placeholder='Designation'
                  maxLength={40}
                  control={form.control}
                />
              </div>
              <div className='flex justify-end gap-x-2'>
                <Button type='button' onClick={()=>{router.push('/employee')}}>Cancel</Button>
                <Button type='submit'>Save</Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}

export default EmployeeForm
