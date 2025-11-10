import { useEffect, useState } from 'react'
import { X, MessageSquare } from 'lucide-react'

export default function IdeaModal({ id, onClose, onComment, fetchIdea }) {
  const [data, setData] = useState(null)
  const [author, setAuthor] = useState('')
  const [text, setText] = useState('')
  const backend = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${backend}/api/ideas/${id}`)
      const json = await res.json()
      setData(json)
    }
    if (id) load()
  }, [id])

  if (!id) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-xl shadow-xl w-[95%] md:w-[720px] max-h-[85vh] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <h3 className="font-semibold">Idea details</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-5 space-y-4 overflow-y-auto max-h-[70vh]">
          {data && (
            <>
              <div>
                <h2 className="text-xl font-semibold">{data.idea.title}</h2>
                <p className="mt-1 text-gray-700">{data.idea.description}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Comments ({data.comments.length})</h4>
                <div className="space-y-3">
                  {data.comments.map(c => (
                    <div key={c.id} className="p-3 rounded-lg border bg-gray-50">
                      <div className="text-sm font-medium">{c.author}</div>
                      <div className="text-sm text-gray-700">{c.text}</div>
                    </div>
                  ))}
                  {data.comments.length === 0 && (
                    <div className="text-sm text-gray-500">No comments yet.</div>
                  )}
                </div>
              </div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  if (!author.trim() || !text.trim()) return
                  await onComment({ post_id: id, author, text })
                  setAuthor(''); setText('')
                  const res = await fetch(`${backend}/api/ideas/${id}`)
                  setData(await res.json())
                }}
                className="p-4 rounded-lg border bg-white"
              >
                <div className="flex items-center gap-2 mb-2 text-sm text-gray-600"><MessageSquare className="h-4 w-4"/> Add a comment</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input value={author} onChange={(e)=>setAuthor(e.target.value)} placeholder="Your name" className="border rounded-lg px-3 py-2"/>
                  <input value={text} onChange={(e)=>setText(e.target.value)} placeholder="Say something nice" className="md:col-span-2 border rounded-lg px-3 py-2"/>
                </div>
                <div className="mt-3">
                  <button className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700">Post comment</button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
