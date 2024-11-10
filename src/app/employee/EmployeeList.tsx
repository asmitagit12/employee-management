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

const EmployeeList = () => {
  const [employeeData, setEmployeeData] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null)
  const router = useRouter()
  useEffect(() => {
    const fetchItem = async () => {
      const response = await fetch(`/api/employee/getall`, {
        method: 'GET'
      })

      const data = await response.json()
      console.log(data)
      setEmployeeData(data)
    }
    fetchItem()
  }, [])

  const handleEdit = (id: string) => {
    // Handle edit action
    console.log('Edit employee with ID:', id)
    router.push(`/employee/${id}`)
  }

  const handleDelete = (data: any) => {
    // Handle delete action
    setOpen(true)
    setSelectedEmployee(data)
    console.log('Delete employee with ID:', data)
  }

  const handleView = (id: string) => {
    // Handle view action
    console.log('View employee with ID:', id)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const confirmDelete = async () => {
    const res = await fetch(`/api/employee/delete/${selectedEmployee?.id}`, {
      method: 'DELETE'
    })

    if (res.ok) {
      setEmployeeData(prevData =>
        prevData.filter(employee => employee.id !== selectedEmployee.id)
      )
      toast({
        title: 'Success',
        description: 'Employee deleted successfully'
      })
    } else {
      const errorData = await res.json()
      toast({
        title: 'Failed',
        description: errorData?.message || 'Error deleting employee',
        variant: 'destructive'
      })
    }
    setOpen(false)
    setSelectedEmployee(null)
  }

  return (
    <>
      <div className='flex flex-col w-full gap-y-2'>
        <div className='w-full flex items-end justify-end flex-1'>
          <Link href={'/employee/create'}>
            <Button>Add Employee</Button>
          </Link>
        </div>
        <Table className='rounded border-slate-400'>
          <TableCaption>A list of your recent employees.</TableCaption>
          <TableHeader>
            <TableRow className='bg-slate-100'>
              <TableHead className='w-[100px]'>Emp. No</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='text-center'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employeeData.length > 0 ? (
              employeeData.map(employee => (
                <TableRow key={employee.id}>
                  <TableCell className='font-medium'>
                    {employee.empNo}
                  </TableCell>
                  <TableCell>{employee.firstName}</TableCell>
                  <TableCell>{employee.lastName}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.mobile}</TableCell>
                  <TableCell>
                    {' '}
                    {new Date(employee.createdAt).toLocaleDateString('en-GB')}
                  </TableCell>
                  <TableCell>{employee.designation}</TableCell>
                  <TableCell>{employee.profileStatus}</TableCell>
                  <TableCell className='flex items-center justify-center'>
                    <div className='flex space-x-2'>
                      <Button
                        variant='ghost'
                        className='p-2'
                        onClick={() => handleView(employee.id)}
                      >
                        <Eye />
                      </Button>
                      <Button
                        variant='ghost'
                        className='p-2'
                        onClick={() => handleEdit(employee.id)}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant='ghost'
                        className='p-2'
                        onClick={() => handleDelete(employee)}
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
                  No employees found.
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
        <p>Are you sure you want to delete employee details</p>
        <br />
        {/* <div className='mt-4 flex gap-2'>
          <Button asChild>
            <Button variant={'ghost'} onClick={handleClose}>
              Cancel
            </Button>
            <Button variant={'ghost'} onClick={confirmDelete}>
              OK
            </Button>
          </Button>
        </div> */}
      </DialogBox>
    </>
  )
}

export default EmployeeList
