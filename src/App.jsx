import { useEffect, useMemo, useState } from 'react'
import Spline from '@splinetool/react-spline'
import { Sparkles, Rocket, Filter, ChevronDown } from 'lucide-react'
import IdeaCard from './components/IdeaCard'
import IdeaModal from './components/IdeaModal'

const backend = import.meta.env.VITE_BACKEND_URL

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full border text-sm transition ${active ? 'bg-violet-600 text-white border-violet-600' : 'bg-white/70 backdrop-blur border-white/60 hover:bg-white'}`}
    >
      {children}
    </button>
  )
}

export default function App() {
  const [ideas, setIdeas] = useState([])
  const [timeframe, setTimeframe] = useState('week') // week, month, all
  const [sort, setSort] = useState('votes') // votes, comments, recent
  const [openId, setOpenId] = useState(null)

  const load = async () => {
    const res = await fetch(`${backend}/api/ideas?timeframe=${timeframe}&sort=${sort}`)
    const json = await res.json()
    setIdeas(json.items)
  }

  useEffect(() => {
    // seed sample ideas once
    fetch(`${backend}/api/seed`, { method: 'POST' }).finally(load)
  }, [])

  useEffect(() => {
    load()
  }, [timeframe, sort])

  const onVote = async (id) => {
    await fetch(`${backend}/api/ideas/${id}/vote`, { method: 'POST' })
    await load()
  }

  const onComment = async (data) => {
    await fetch(`${backend}/api/comments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    await load()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-violet-50 to-blue-50">
      {/* Hero with Spline */}
      <div className="relative">
        <div className="h-[360px] md:h-[500px]">
          <Spline scene="https://prod.spline.design/VJLoxp84lCdVfdZu/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/70 via-white/30 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-2xl mx-auto px-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur border border-white/60 text-violet-700"><Sparkles className="h-4 w-4"/> Built with Vibe Coding</div>
            <h1 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">Hunt-worthy Ideas, Built by Vibe</h1>
            <p className="mt-3 text-gray-600 md:text-lg">Share ideas, upvote, and discuss what should be built next. We prioritize the most loved ideas and spin them into reality.</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-5xl mx-auto px-6 -mt-10 relative z-10">
        <div className="bg-white/80 backdrop-blur rounded-2xl border border-white/60 shadow p-4 md:p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Chip active={timeframe==='week'} onClick={()=>setTimeframe('week')}>This week</Chip>
              <Chip active={timeframe==='month'} onClick={()=>setTimeframe('month')}>This month</Chip>
              <Chip active={timeframe==='all'} onClick={()=>setTimeframe('all')}>All time</Chip>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by</span>
              <div className="flex gap-2">
                <Chip active={sort==='votes'} onClick={()=>setSort('votes')}>Votes</Chip>
                <Chip active={sort==='comments'} onClick={()=>setSort('comments')}>Comments</Chip>
                <Chip active={sort==='recent'} onClick={()=>setSort('recent')}>Recency</Chip>
              </div>
            </div>
          </div>
        </div>

        {/* Post form */}
        <PostForm onPosted={load} />

        {/* List */}
        <div className="mt-6 grid grid-cols-1 gap-4">
          {ideas.map(idea => (
            <IdeaCard key={idea.id} idea={idea} onVote={onVote} onOpen={setOpenId} />
          ))}
          {ideas.length === 0 && (
            <div className="text-center text-gray-500 p-6">No ideas yet. Be the first to post!</div>
          )}
        </div>
      </div>

      <IdeaModal id={openId} onClose={() => setOpenId(null)} onComment={onComment} />
    </div>
  )
}

function PostForm({ onPosted }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [link, setLink] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return
    await fetch(`${backend}/api/ideas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, link: link || null })
    })
    setTitle(''); setDescription(''); setLink('')
    onPosted?.()
  }

  return (
    <form onSubmit={submit} className="mt-6 grid gap-3 bg-white/80 backdrop-blur rounded-2xl border border-white/60 shadow p-4 md:p-5">
      <div className="text-sm font-medium text-gray-700">Post a new idea</div>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="border rounded-lg px-3 py-2" />
      <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Describe what to build" rows={3} className="border rounded-lg px-3 py-2" />
      <input value={link} onChange={e=>setLink(e.target.value)} placeholder="Optional link (repo, mock, etc.)" className="border rounded-lg px-3 py-2" />
      <div className="flex justify-end">
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700"><Rocket className="h-4 w-4"/> Share idea</button>
      </div>
    </form>
  )
}
