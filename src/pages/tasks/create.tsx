import { useRouter } from 'next/router'
import { useState, useEffect, CSSProperties } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function CreateTask() {
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium',
    status: 'todo',
    assigned_to: '',
  })
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const getData = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        console.error('Session error:', sessionError)
        return
      }

      const authUser = session?.user
      if (!authUser) {
        console.error('No authenticated user found.')
        return
      }

      // Check for existing user in the custom users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', authUser.email)
        .single()

      let userId: string

      if (userData) {
        userId = userData.id
      } else {
        // Insert the user into custom users table
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert([{ email: authUser.email, password: 'placeholder' }]) // dummy password or null if allowed
          .select('id')
          .single()

        if (insertError) {
          console.error('Error inserting user:', insertError)
          return
        }

        userId = newUser.id
      }

      setUserId(userId)

      // Fetch all users for the assign-to dropdown
      const { data: userList, error: listError } = await supabase
        .from('users')
        .select('id, email')

      if (listError) {
        console.error('Error fetching users:', listError)
        return
      }

      setUsers(userList || [])
    }

    getData()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userId) {
      alert('User ID not set. Cannot create task.')
      return
    }

    const task = {
      ...form,
      created_by: userId,
      assigned_to: form.assigned_to === '' ? null : form.assigned_to,
    }

    console.log('Submitting task:', task) // Debug log

    const { error } = await supabase.from('tasks').insert(task)

    if (error) {
      console.error('Insert error:', error)
      alert(error.message)
    } else {
      alert('Task created!')
      router.push('/tasks')
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Create New Task</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="title" style={styles.label}>Title:</label>
          <input
            type="text"
            name="title"
            id="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="description" style={styles.label}>Description:</label>
          <textarea
            name="description"
            id="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            style={styles.textarea}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="due_date" style={styles.label}>Due Date:</label>
          <input
            type="date"
            name="due_date"
            id="due_date"
            value={form.due_date}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="priority" style={styles.label}>Priority:</label>
          <select name="priority" id="priority" value={form.priority} onChange={handleChange} style={styles.select}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="status" style={styles.label}>Status:</label>
          <select name="status" id="status" value={form.status} onChange={handleChange} style={styles.select}>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="assigned_to" style={styles.label}>Assign to:</label>
          <select name="assigned_to" id="assigned_to" value={form.assigned_to} onChange={handleChange} style={styles.select}>
            <option value="">Assign to...</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.email.split('@')[0]}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" style={styles.submitButton}>Create Task</button>
      </form>
    </div>
  )
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    padding: '2rem',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  },
  input: {
    padding: '0.75rem',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  textarea: {
    padding: '0.75rem',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    outline: 'none',
    resize: 'vertical',
    minHeight: '100px',
    transition: 'border-color 0.3s',
  },
  select: {
    padding: '0.75rem',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  submitButton: {
    padding: '0.75rem',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
}

