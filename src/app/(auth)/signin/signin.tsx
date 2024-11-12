'use client'
import Link from 'next/link'
import Script from 'next/script'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { LoaderCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { useMounted } from '@/hooks/use-mounted'
import { signIn } from 'next-auth/react'
import { RECAPTCHA_SITE_KEY } from '@/utils/constant'
import { InputController } from '@/components/custom/form.control/InputController'
import ToggleButtons from '@/components/custom/layout/ToggleButtons'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFacebook,
  faGit,
  faGithub,
  faGoogle
} from '@fortawesome/free-brands-svg-icons'

const signInSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
    .max(10, 'Password must be less than 10 characters')
})

type signInT = z.infer<typeof signInSchema>

export default function SignInPage () {
  const mounted = useMounted()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const form = useForm<signInT>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: 'asmita.patil@gmail.com',
      password: 'admin123'
    }
  })

  const onSubmit = async (data: signInT) => {
    setLoading(true)
    signIn('credentials', {
      ...data,
      redirect: false
    }).then(callback => {
      setLoading(false)
      if (callback?.ok) {
        router.push('/')
        router.refresh()
        //   toast.success('Logged In')
      }

      if (callback?.error) {
        toast({
          title: 'Error',
          description: 'Invalid credentials',
          variant: 'destructive'
        })
        console.log(callback.error)
      }
    })
    // // get captch
    // const token = await new Promise<string>((resolve) => {
    //     window.grecaptcha.execute(RECAPTCHA_SITE_KEY as string, { action: 'submit' }).then(resolve);
    // });

    // get user
    // const response = await fetch('/api/user', {
    //     method:"POST",
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({...data}),
    // }).then((res) => {
    //     return res.json();
    // })

    // if(response.type === "CredentialsSignin" || response.code === "credentials"){
    //     toast({
    //         title: "Error",
    //         description: "Invalid credentials",
    //         variant:'destructive'
    //     });
    //     setLoading(false);
    // } else {
    //     window.location.href = '/dashboard'
    // }
  }

  const renderButtonContent = () => {
    if (loading) {
      return (
        <>
          <LoaderCircle className='mr-2 h-4 w-4 animate-spin' /> Logging...
        </>
      )
    }
    return 'Login'
  }

  return (
    mounted && (
      <>
        <Form {...form}>
          <form
            id='form_submit'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex items-start justify-start'
          >
            <div className='mx-auto grid w-full gap-5'>
              <div className='grid gap-2 text-left'>
                <h1 className='text-2xl font-semibold tracking-tight'>Sign in</h1>
                <p className='text-muted-foreground text-sm'>
                  Enter your email below to access TeamEdge Home
                </p>
              </div>
              <div className='grid gap-4 col-span-8'>
                <div className='grid gap-2'>
                  <InputController name='email' label='Email' type='email' />
                </div>
                <div className='grid gap-2'>
                  <InputController
                    name='password'
                    label='Password'
                    type='password'
                  />
                </div>
                <Button type='submit' className='w-full h-10 text-lg bg-[#007AFF] hover:bg-[#005BB5]' disabled={loading}>
                  {renderButtonContent()}
                </Button>
               
                <p className='text-sm pt-4'>Sign in using</p>
                <div className='flex items-center space-x-1'>
                  <div>
                    <FontAwesomeIcon
                      icon={faGoogle}
                      className='h-5 w-5 text-slate-600 border p-2 rounded-sm'
                      style={{ color: '#DB4437' }}
                    />
                  </div>
                  <div>
                    <FontAwesomeIcon
                      icon={faGithub}
                      className='h-5 w-5 text-slate-600 border p-2 rounded-sm'
                      style={{ color: '#333' }}
                    />
                  </div>
                  <div>
                    <FontAwesomeIcon
                      icon={faFacebook}
                      className='h-5 w-5 text-slate-600 border p-2 rounded-sm'
                      style={{ color: '#4267B2' }}
                    />
                  </div>
                </div>
              </div>
              <div className='text-left text-sm'>
                Don&apos;t have an account?&nbsp;
                <Link href='/signup' className='underline'>
                
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </>
    )
  )
}
