'use client'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const UpdateLeave = () => {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [rowData, setRowData] = useState<any>(null)
  const [leaveDetails, setLeaveDetails] = useState<any>(null)
  const user = session?.user
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    if (params) {
      const fetchItem = async () => {
        const response = await fetch(`/api/leave/id`, {
          method: 'POST',
          body: JSON.stringify({ id: params.leaveId })
        })

        const data = await response.json()
        setLeaveDetails(data)
        console.log('data', data)
      }

      fetchItem()
    }
  }, [params])

  const updateStatus = async (newStatus: string) => {
    // Implement status update functionality
    alert(`Updating status to: ${newStatus}`)
  }
  return (
    <div className='mt-7 p-8 bg-gradient-to-br from-white to-gray-100 shadow-xl rounded-2xl border border-gray-200'>
      {loading ? (
        <div className='text-center py-10'>
          <p className='text-lg text-gray-600 animate-pulse'>
            Loading leave details...
          </p>
        </div>
      ) : leaveDetails ? (
        <div className='space-y-6'>
          <div className='border-b pb-4 mb-4'>
            <h2 className='text-2xl font-bold text-gray-800'>Leave Details</h2>
            <p className='text-sm text-gray-500'>
              Review and update the leave request
            </p>
          </div>
          <div className='flex space-x-5'>
            <div className='bg-white p-6 w-1/2 rounded-lg shadow-sm space-y-2'>
              <h3 className='text-xl font-semibold mb-2 text-gray-700'>
                Employee Information
              </h3>
              <p className='text-gray-600'>
                <strong>Name:</strong>{' '}
                {`${leaveDetails.user.firstName} ${leaveDetails.user.lastName}`}
              </p>
              <p className='text-gray-600'>
                <strong>Email:</strong> {leaveDetails.user.email}
              </p>
              <p className='text-gray-600'>
                <strong>Designation:</strong> {leaveDetails.user.designation}
              </p>
            </div>

            <div className='bg-white p-6 w-1/2 rounded-lg shadow-sm space-y-2'>
              <h3 className='text-xl font-semibold mb-2 text-gray-700'>
                Leave Information
              </h3>
              <p className='text-gray-600'>
                <strong>Type:</strong> {leaveDetails.leaveType}
              </p>
              <p className='text-gray-600'>
                <strong>Reason:</strong> {leaveDetails.leaveReason}
              </p>
              <p className='text-gray-600'>
                <strong>Start Date:</strong>{' '}
                {new Date(leaveDetails.startDate).toLocaleDateString()}
              </p>
              <p className='text-gray-600'>
                <strong>End Date:</strong>{' '}
                {new Date(leaveDetails.endDate).toLocaleDateString()}
              </p>
              <p className='text-gray-600'>
                <strong>Status:</strong>
                <span
                  className={`inline-block ml-2 px-3 py-1 rounded-full font-medium ${
                    leaveDetails.status === 'APPROVED'
                      ? 'bg-green-100 text-green-800'
                      : leaveDetails.status === 'REJECTED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {leaveDetails.status}
                </span>
              </p>
            </div>
          </div>
          <div className='mt-6 flex justify-end space-x-4'>
            <button
              onClick={() => updateStatus('APPROVED')}
              className='px-4 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transform transition duration-300'
            >
              Approve
            </button>
            <button
              onClick={() => updateStatus('REJECTED')}
              className='px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transform transition duration-300'
            >
              Reject
            </button>
            <button
              onClick={() => updateStatus('PENDING')}
              className='px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transform transition duration-300'
            >
              Mark as Pending
            </button>
          </div>
        </div>
      ) : (
        <div className='text-center py-10'>
          <p className='text-lg text-gray-500'>No leave details found</p>
        </div>
      )}
    </div>
  )
}

export default UpdateLeave
