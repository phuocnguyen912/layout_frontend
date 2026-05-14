import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { format, isSameMonth, parseISO } from 'date-fns'
import toast, { Toaster } from 'react-hot-toast'
import { ArrowPath, CalendarDays, Check, ArrowRight, Clock3 } from 'lucide-react'

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000/api',
  timeout: 10000,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error)
    return Promise.reject(error)
  }
)

const attendanceService = {
  getAttendance: async () => {
    const res = await api.get('/attendance')
    return res.data
  },
  syncAttendance: async () => {
    const res = await api.post('/attendance/sync')
    return res.data
  },
  checkIn: async (data) => {
    const res = await api.post('/attendance/checkin', data)
    return res.data
  },
  checkOut: async (data) => {
    const res = await api.post('/attendance/checkout', data)
    return res.data
  },
}

function Loader() {
  return (
    <div className="flex items-center justify-center p-10">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
    </div>
  )
}

function ErrorBox({ message }) {
  return (
    <div className="rounded-lg bg-red-100 p-4 text-red-600">{message}</div>
  )
}

function AttendanceFilter({ search, setSearch, month, setMonth }) {
  return (
    <div className="mb-5 grid gap-4 md:grid-cols-3">
      <input
        type="text"
        placeholder="Search employee"
        className="rounded-lg border border-slate-300 px-4 py-3 shadow-sm outline-none transition focus:border-blue-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <input
        type="month"
        className="rounded-lg border border-slate-300 px-4 py-3 shadow-sm outline-none transition focus:border-blue-500"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      />
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        Use the month picker to filter attendance by date. Filter by employee name for quick lookup.
      </div>
    </div>
  )
}

function AttendanceStats({ attendance }) {
  const late = attendance.filter((x) => x.status === 'late').length
  const present = attendance.filter((x) => x.status === 'present').length
  const leave = attendance.filter((x) => x.status === 'leave').length

  const cards = [
    { title: 'Present', value: present, color: 'from-sky-500 to-indigo-500' },
    { title: 'Late', value: late, color: 'from-amber-500 to-orange-500' },
    { title: 'Leave', value: leave, color: 'from-emerald-500 to-teal-500' },
  ]

  return (
    <div className="mb-6 grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div key={card.title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{card.title}</p>
          <p className="mt-4 text-4xl font-semibold text-slate-900">{card.value}</p>
        </div>
      ))}
    </div>
  )
}

function AttendanceTable({ attendance }) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      <table className="min-w-full border-collapse text-left">
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            <th className="p-4 font-medium">Employee</th>
            <th className="p-4 font-medium">Date</th>
            <th className="p-4 font-medium">Check In</th>
            <th className="p-4 font-medium">Check Out</th>
            <th className="p-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {attendance.length === 0 ? (
            <tr>
              <td colSpan="5" className="p-8 text-center text-slate-500">
                No attendance records available.
              </td>
            </tr>
          ) : (
            attendance.map((item) => (
              <tr key={item.id} className="border-t border-slate-200">
                <td className="p-4 text-slate-900">{item.employee}</td>
                <td className="p-4 text-slate-700">{item.date}</td>
                <td className="p-4 text-slate-700">{item.checkIn || '-'}</td>
                <td className="p-4 text-slate-700">{item.checkOut || '-'}</td>
                <td className="p-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                      item.status === 'present'
                        ? 'bg-emerald-100 text-emerald-700'
                        : item.status === 'late'
                        ? 'bg-amber-100 text-amber-700'
                        : item.status === 'leave'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

function AttendanceCalendar({ attendance, date, setDate }) {
  const datesWithAttendance = useMemo(() => {
    return attendance.map((item) => item.date)
  }, [attendance])

  const tileContent = ({ date: tileDate }) => {
    const tileValue = format(tileDate, 'yyyy-MM-dd')
    if (datesWithAttendance.includes(tileValue)) {
      return <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
    }
    return null
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="mb-4 flex items-center gap-3 text-slate-700">
        <CalendarDays className="h-5 w-5" />
        <div>
          <h3 className="text-lg font-semibold">Attendance Calendar</h3>
          <p className="text-sm text-slate-500">Highlighted days contain recorded attendance.</p>
        </div>
      </div>
      <Calendar
        onChange={setDate}
        value={date}
        calendarType="US"
        tileContent={tileContent}
        tileClassName={({ date: tileDate }) =>
          isSameMonth(tileDate, date) ? 'text-slate-900' : 'text-slate-400'
        }
      />
    </div>
  )
}

function CheckInOutCard({ employees, selectedEmployee, setSelectedEmployee, onCheckIn, onCheckOut, loading }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Check In / Check Out</h2>
            <p className="mt-1 text-sm text-slate-500">Record attendance quickly for your team.</p>
          </div>
          <Clock3 className="h-6 w-6 text-slate-400" />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <select
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm outline-none"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">Select employee</option>
            {employees.map((employee) => (
              <option key={employee} value={employee}>
                {employee}
              </option>
            ))}
          </select>
          <div className="space-y-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Quick actions</p>
            <button
              disabled={!selectedEmployee || loading}
              onClick={onCheckIn}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Check className="h-4 w-4" />
              Check In
            </button>
            <button
              disabled={!selectedEmployee || loading}
              onClick={onCheckOut}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <ArrowRight className="h-4 w-4" />
              Check Out
            </button>
          </div>
        </div>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 p-6 text-white shadow-sm">
        <h3 className="text-xl font-semibold">Live Attendance Sync</h3>
        <p className="mt-3 text-sm text-sky-100">
          Use the sync panel to keep backend attendance data up to date, then use the table to verify the latest entries.
        </p>
        <div className="mt-6 rounded-3xl bg-white/10 p-5">
          <p className="text-sm text-slate-100">Active employees</p>
          <p className="mt-3 text-3xl font-semibold">{employees.length}</p>
        </div>
      </div>
    </div>
  )
}

function SyncPanel({ syncing, onSync }) {
  return (
    <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Attendance Sync</h2>
          <p className="text-sm text-slate-500">Realtime synchronization with the backend server.</p>
        </div>
        <button
          onClick={onSync}
          disabled={syncing}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <ArrowPath className="h-4 w-4" />
          {syncing ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>
    </div>
  )
}

export default function AttendancePage() {
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [syncing, setSyncing] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [search, setSearch] = useState('')
  const [month, setMonth] = useState('')
  const [date, setDate] = useState(new Date())

  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await attendanceService.getAttendance()
      setAttendance(Array.isArray(data) ? data : [])
    } catch (err) {
      setError('Failed to fetch attendance data.')
      toast.error('Load attendance failed')
    } finally {
      setLoading(false)
    }
  }, [])

  const syncData = useCallback(async () => {
    try {
      setSyncing(true)
      await attendanceService.syncAttendance()
      toast.success('Sync completed')
      await fetchAttendance()
    } catch (err) {
      toast.error('Sync failed')
    } finally {
      setSyncing(false)
    }
  }, [fetchAttendance])

  const handleCheckIn = async () => {
    if (!selectedEmployee) return

    try {
      setLoading(true)
      await attendanceService.checkIn({ employee: selectedEmployee })
      toast.success(`${selectedEmployee} checked in successfully.`)
      fetchAttendance()
    } catch (err) {
      toast.error('Check in failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckOut = async () => {
    if (!selectedEmployee) return

    try {
      setLoading(true)
      await attendanceService.checkOut({ employee: selectedEmployee })
      toast.success(`${selectedEmployee} checked out successfully.`)
      fetchAttendance()
    } catch (err) {
      toast.error('Check out failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttendance()
    const interval = setInterval(fetchAttendance, 15000)
    return () => clearInterval(interval)
  }, [fetchAttendance])

  const filteredAttendance = useMemo(() => {
    return attendance.filter((item) => {
      const matchesName = item.employee.toLowerCase().includes(search.toLowerCase())
      const matchesMonth = month ? item.date.startsWith(month) : true
      return matchesName && matchesMonth
    })
  }, [attendance, search, month])

  const employeeOptions = useMemo(() => {
    return Array.from(new Set(attendance.map((item) => item.employee))).sort()
  }, [attendance])

  if (loading) return <Loader />
  if (error) return <ErrorBox message={error} />

  return (
    <div className="space-y-6 p-6">
      <Toaster position="top-right" />
      <SyncPanel syncing={syncing} onSync={syncData} />
      <AttendanceStats attendance={filteredAttendance} />
      <AttendanceFilter search={search} setSearch={setSearch} month={month} setMonth={setMonth} />
      <CheckInOutCard
        employees={employeeOptions}
        selectedEmployee={selectedEmployee}
        setSelectedEmployee={setSelectedEmployee}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
        loading={loading}
      />
      <AttendanceCalendar attendance={attendance} date={date} setDate={setDate} />
      <AttendanceTable attendance={filteredAttendance} />
    </div>
  )
}
