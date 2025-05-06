import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function TaskDetail() {
  const router = useRouter()
  const { id } = router.query

  const [task, setTask] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium',
    status: 'todo',
  })

  // Fetch task on load
  useEffect(() => {
    if (id) {
      fetchTask(id as string)
    }
  }, [id])

  const fetchTask = async (taskId: string) => {
    const { data, error } = await supabase.from('tasks').select('*').eq('id', taskId).single()
    if (error) {
      setError(error.message)
    } else {
      setTask(data)
      setForm({
        title: data.title || '',
        description: data.description || '',
        due_date: data.due_date ? data.due_date.slice(0, 10) : '',
        priority: data.priority || 'medium',
        status: data.status || 'todo',
      })
    }
    setLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('tasks').update(form).eq('id', id)
    if (error) {
      setError(error.message)
    } else {
      alert('Task updated!')
      router.push('/tasks')
    }
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      const { error } = await supabase.from('tasks').delete().eq('id', id)
      if (error) {
        setError(error.message)
      } else {
        alert('Task deleted!')
        router.push('/tasks')
      }
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Edit Task</h1>
      <form onSubmit={handleUpdate} style={styles.form}>
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

        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.submitButton}>Update Task</button>
          <button type="button" onClick={handleDelete} style={styles.deleteButton}>
            Delete Task
          </button>
        </div>
      </form>
    </div>
  )
}

const styles = {
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
    gap: '1.5rem',
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
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
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
  deleteButton: {
    padding: '0.75rem',
    fontSize: '1rem',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
}

