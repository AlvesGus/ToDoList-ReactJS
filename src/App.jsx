import { Check, Loader, Pencil, Plus, Trash, X } from "lucide-react"
import { useEffect, useState } from "react"
import { api } from './services/api'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const [tasks, setTasks] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [task, setTask] = useState('')
  const [status, setStatus] = useState(false)
  const [taskUpdate, setTaskUpdate] = useState('')
  const [priority, setPriority] = useState(false)
  const [taskId, setTaskId] = useState('')



  const handlePriorityChange = (e) => {
      const value = e.target.value === 'true';
      setPriority(value);
  };
  const handleStatusChange = (e) => {
      const value = e.target.value === 'true'; 
      setStatus(value);
  };

  //list all tasks req.api
  useEffect( () => {
      api.get('/tasks').then(response => setTasks(response.data))
  }, [])

  async function addNewTask(e) {
    e.preventDefault()
    if(!task){
      toast.info('Preencha todos os dados')
    }else{
      await api.post('tasks/new', {
        task,
        priority
      }).then(
        setTask(''),
        setStatus(false),
        setPriority(false),
        toast.success('Tarefa Cadastrada'),
        setIsModalOpen(false)
      )
    }
    window.document.location.reload()
  }
                        
  async function deleteTask(taskId){
    await api.delete(`/tasks/${taskId}/delete`).then(
      toast.success('Tarefa excluída com sucesso'),
    )
    window.document.location.reload()
  }
  

  async function updateTask() {
    await api.put(`/task/update/${taskId}`, {
      task: taskUpdate,
      status,
      priority
    }).then(
      setIsUpdateModalOpen(false),
    )
    window.document.location.reload()
  }

  async function completeTask(taskId) {
    await api.put(`/task/update/${taskId}`, {
     status: true
   })
  }

  return (
    <><ToastContainer />
    <div className="w-full h-screen relative">
      <div className="max-w-[1024px] m-auto pt-24">
        <div className="flex items-center justify-between">
          <h2 className="text-5xl">Tarefas diárias:</h2>
          <div>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1 text-slate-500 hover:text-slate-50 transition-colors">
              <Plus  size={15}/>
              Nova tarefa
            </button> 
          </div>
        </div>
          <div className="border-b border-slate-800 pt-1"/>

        <div className="max-w-[1024px] pt-4">
          <table className="w-full">
            <thead>
              <tr className="flex items-center border-b border-slate-800">
                <th className="w-[150px] flex items-center gap-2">
                  <Loader size={15}/>
                  Status
                </th>
                <th className="flex-1 text-left">Tarefa</th>
                <th className="w-[150px] text-left">
                  Prioridade
                </th>
                <th className="w-[150px] flex items-center gap-2">
                  <Pencil size={15}/>
                  Editar
                </th>
                <th>
               
                </th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                 <tr key={task.id} className="flex items-center pt-3 pb-1 border-b border-slate-800">
                  <td className="w-[150px] text-left">
                  {task.status ? 'Concluído' : 'Em aberto'}
                  </td>
                  <td className="flex-1 text-left">
                    {task.task}
                  </td>
                  <td className="w-[150px] flex text-left">
                    {task.priority ? 'Alta' : 'Baixa'}
                  </td>
                  <td className="w-[150px] flex items-center gap-2">
                    <Pencil 
                      size={20} 
                      className="text-slate-500 hover:text-slate-50 cursor-pointer"
                      onClick={() => {
                        const taskId = task.id
                        setTaskId(taskId)
                        updateTask()
                        setIsUpdateModalOpen(true)
                      }}
                    />
                    <Trash 
                      size={20} 
                      className="text-slate-500 hover:text-red-500 cursor-pointer"
                      onClick={() => {
                        const taskId = task.id
                        deleteTask(taskId)
                      }}
                    />
                      <Check
                        size={20} 
                        className="text-slate-500 hover:text-slate-50 cursor-pointer"
                        onClick={() => {
                          const taskId = task.id
                          completeTask(taskId)
                        }}
                      />
                   
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="w-full h-screen bg-black/60 fixed inset-0 flex items-center justify-center">
          <div className="w-[460px] h-[320px] border border-slate-800 rounded-md bg-slate-950 p-4">
            <div className="w-full flex items-center justify-between">
              <h2 className="text-xl">Adicione suas novas tarefas:</h2> 
              <X size={20} className="cursor-pointer hover:text-red-500 transition-colors" onClick={() => setIsModalOpen(false)}/>
            </div>
            <div>
              <form className="w-full">
                <textarea value={task} onChange={(e) => setTask(e.target.value)} className="mt-6 w-full h-24 resize-none outline-none text-slate-950 p-2 rounded-md"  placeholder="Digite sua tarefa"></textarea>
                  <div className="flex items-center justify-between">
                    <div className="text-slate-50 flex flex-col">
                      <label>Prioridade: </label>
                      <select value={priority.toString()} onChange={handlePriorityChange} className="text-slate-950 w-[170px] rounded-md  px-2 py-1">
                        <option value={false}>Baixa</option>   
                        <option value={true}>Alta</option>   
                      </select>                      
                    </div>
                  </div>

                    <button onClick={addNewTask} type='submit' className="w-full flex justify-center font-semibold bg-lime-500 text-lime-950 py-2 px-4 mt-6 rounded-md hover:bg-lime-400 transition-colors">
                      Adicionar tarefa
                    </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {isUpdateModalOpen && (
        <div className="w-full h-screen bg-black/60 fixed inset-0 flex items-center justify-center">
          <div className="w-[460px] h-[320px] border border-slate-800 rounded-md bg-slate-950 p-4">
            <div className="w-full flex items-center justify-between">
              <h2 className="text-xl">Atualize sua tarefa:</h2> 
              <X size={20} className="cursor-pointer hover:text-red-500 transition-colors" onClick={() => setIsUpdateModalOpen(false)}/>
            </div>
            <div>
              <div className="w-full">
                <textarea value={taskUpdate} onChange={(e) => setTaskUpdate(e.target.value)} className="mt-6 w-full h-24 resize-none outline-none text-slate-950 p-2 rounded-md" placeholder="Digite sua tarefa"></textarea>
                  <div className="flex items-center justify-between">
                    <div className="text-slate-50 flex flex-col">
                      <label>Prioridade: </label>
                      <select value={priority.toString()} onChange={handlePriorityChange} className="text-slate-950 w-[170px] rounded-md  px-2 py-1">
                        <option value={false}>Baixa</option>   
                        <option value={true}>Alta</option>   
                      </select>                      
                    </div>
                    <div className="text-slate-50 flex flex-col">
                      <label>Status: </label>
                      <select value={status.toString()} onChange={handleStatusChange} className="text-slate-950 w-[170px] rounded-md  px-2 py-1">
                        <option value={false}>Em aberto</option>   
                        <option value={true}>Concluído</option>   
                      </select>                      
                    </div>
                  </div>

                  <button onClick={updateTask} className="w-full flex justify-center font-semibold bg-lime-500 text-lime-950 py-2 px-4 mt-6 rounded-md hover:bg-lime-400 transition-colors">
                    Atualizar tarefa
                  </button>
              </div>
            </div>
          </div>
        </div>
      )}
      

    </div>
    </>
  )
}