// components/AdminComments.tsx
'use client'
import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { format } from 'date-fns'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { TrashIcon, EditIcon, SendIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import DialogBox from '@/components/custom/dialog-box'

type CreatedBy = {
  firstName: string
  lastName: string
}

type CommentData = {
  createdById: string
  createdBy: CreatedBy
  taskid: string
  comment: string
  createdAt?: string
  id?: string
}

type Props = {
  taskId: string
}

const CommentsPage: React.FC<Props> = ({ taskId }) => {
  const [allComments, setAllComments] = useState<CommentData[]>([])
  const [isUpdate, setIsUpdate] = useState(false)
  const [open, setOpen] = useState(false)
  const [selectedComment, setSelectedComment] = useState<CommentData | null>(
    null
  )
  const { control, handleSubmit, setValue, reset } = useForm<CommentData>()
  const { data: session, status } = useSession()
  const user = session?.user

  // Check if the session is still loading
  if (status === 'loading') {
    return <p>Loading...</p>
  }

  useEffect(() => {
    const fetchItem = async () => {
      const response = await fetch(`/api/comments/getall?taskId=${taskId}`, {
        method: 'GET'
      })

      if (!response.ok) {
        console.error('Failed to fetch comments:', response.statusText)
        return // Exit if there's an error
      }

      const data = await response.json()
      console.log('Fetched comments:', data) // Log the data for debugging
      if (Array.isArray(data)) {
        const sortedComments = data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        setAllComments(sortedComments)
      } else {
        console.error('Data is not an array:', data)
        setAllComments([]) // Reset to empty array
      }
    }
    fetchItem()
  }, [taskId]) // Ensure taskId is part of the dependency array if it changes

  const onSubmit = async (data: CommentData) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'User not found. Please log in.',
        variant: 'destructive'
      })
      return
    }

    if (selectedComment && isUpdate) {
      const payload = {
        comment: data.comment,
        createdById: user.id,
        taskId
      }

      const res = await fetch(`/api/comments/update/${selectedComment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        const updatedComment = await res.json()
        toast({
          title: 'Success',
          description: 'Comment updated successfully!'
        })
        setAllComments(prevComments =>
          prevComments.map(comment =>
            comment.id === updatedComment.id ? updatedComment : comment
          )
        )
      } else {
        const errorData = await res.json()
        toast({
          title: 'Failed',
          description: errorData?.message || 'Error updating comment',
          variant: 'destructive'
        })
      }
      reset()
      setIsUpdate(false)
      setSelectedComment(null)
    } else {
      const payload = {
        comment: data.comment,
        createdById: user.id,
        taskId
      }

      const res = await fetch('/api/comments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        const newComment = await res.json() // Parse the new comment returned from the server
        toast({
          title: 'Success',
          description: 'Comment added'
        })
        console.log(newComment)
        setAllComments(prevComments => [newComment.comment, ...prevComments]) // Add the new comment to the start of the list
      } else {
        const errorData = await res.json()
        toast({
          title: 'Failed',
          description: errorData?.message || 'Error creating comment',
          variant: 'destructive'
        })
      }
      reset()
      setIsUpdate(false)
      setSelectedComment(null)
    }
  }

  const handleEdit = (comment: CommentData) => {
    setIsUpdate(true)
    setSelectedComment(comment)
    console.log('comment', comment)
    setValue('comment', comment.comment)
  }

  const handleDelete = async (comment: CommentData) => {
    // Delete comment logic here
    setOpen(true)
    setSelectedComment(comment)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const confirmDelete = async () => {
    const res = await fetch(`/api/comments/delete/${selectedComment?.id}`, {
      method: 'DELETE'
    })

    if (res.ok) {
      setAllComments(prevData =>
        prevData.filter(comment => comment?.id !== selectedComment?.id)
      )
      toast({
        title: 'Success',
        description: 'Comment deleted successfully'
      })
    } else {
      const errorData = await res.json()
      toast({
        title: 'Failed',
        description: errorData?.message || 'Error deleting comment',
        variant: 'destructive'
      })
    }
    setOpen(false)
    setSelectedComment(null)
  }

  return (
    <>
      <div className='flex flex-col space-y-4 mt-3 bg-white p-6 rounded-lg'>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex items-center space-x-2 mb-4'
        >
          <Controller
            name='comment'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <Input
                {...field}
                placeholder='Type a message...'
                className='flex-grow rounded-full px-4 py-2'
              />
            )}
          />
          <Button
            type='submit'
            className='bg-blue-500 text-white rounded-full p-2 flex items-center'
          >
            <SendIcon />
          </Button>
        </form>
        <div className='space-y-4 w-full p-4 overflow-auto max-h-[400px]'>
          {Array.isArray(allComments) && allComments.length > 0 ? (
            allComments.map(comment => (
              <div
                key={comment.id}
                className='flex items-start space-x-3 w-auto'
              >
                {user?.id !== comment?.createdById && (
                  <Avatar>
                    <AvatarImage
                      src='/path-to-avatar.jpg'
                      alt={`${comment.createdBy?.firstName} ${comment.createdBy?.lastName}`}
                    />
                    <AvatarFallback>
                      {`${comment.createdBy?.firstName?.[0]}${comment.createdBy?.lastName?.[0]}` ||
                        'A'}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className='flex-1 relative'>
                  {/* Triangle Pointer */}
                  {/* <div
                    style={{
                      content: '',
                      position: 'absolute',
                      top: '10px', // Adjust vertical position
                      left: '-10px', // Adjust horizontal position
                      width: '0',
                      height: '0',

                      borderWidth: '8px 10px 8px 0',
                      borderColor: 'transparent #F3F4F6 transparent transparent'
                    }}
                  ></div> */}
                  {/* Triangle Pointer */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px', // Adjust vertical position as needed
                      [user?.id === comment?.createdById ? 'right' : 'left']:
                        '-10px', // Conditional placement
                      width: '0',
                      height: '0',
                      borderStyle: 'solid',
                      borderWidth: '8px 10px 8px 0',
                      borderColor: `transparent ${
                        user?.id === comment?.createdById
                          ? '#F3F4F6'
                          : '#F3F4F6'
                      } transparent transparent`,
                      transform:
                        user?.id === comment?.createdById
                          ? 'rotateY(180deg)'
                          : 'none' // Flip if on the right
                    }}
                  ></div>
                  <Card className='p-3 bg-gray-100 border-none w-auto'>
                    <CardContent className='flex justify-between items-start text-xs text-gray-500 mt-2'>
                      <div>
                        <div className='flex items-center space-x-2'>
                          <p className='font-semibold text-sm'>
                            {comment.createdBy?.firstName}{' '}
                            {comment.createdBy?.lastName}
                          </p>
                          <span className='text-xs text-gray-500'>
                            {comment.createdAt
                              ? format(
                                  new Date(comment.createdAt),
                                  'yyyy-MM-dd HH:mm'
                                )
                              : 'Date not available'}
                          </span>
                        </div>
                        <p className='text-gray-700 text-sm mt-2'>
                          {comment.comment}
                        </p>
                      </div>
                      {user?.id === comment?.createdById && (
                        <div className='flex space-x-2'>
                          <button
                            onClick={() => handleEdit(comment)}
                            className='text-blue-500 hover:text-blue-700'
                          >
                            <EditIcon size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(comment)}
                            className='text-red-500 hover:text-red-700'
                          >
                            <TrashIcon size={16} />
                          </button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))
          ) : (
            <p className='text-gray-500 text-sm'>No comments available.</p>
          )}
        </div>
      </div>

      <DialogBox
        open={open}
        setClose={handleClose}
        title={'Delete this message permanently?'}
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
        <br />
        <p>{`${selectedComment?.createdBy?.firstName} ${selectedComment?.createdBy?.lastName} : ${selectedComment?.comment}`}</p>
        <br />
        <p>Other participants can see that a comment was deleted.</p>
      </DialogBox>
    </>
  )
}

export default CommentsPage
