import { useState, useEffect, useMemo } from 'react';
import { useTaskStore } from '../../store/task.store';
import { useWorkspaceStore } from '../../store/workspace.store';
import { taskAPI } from '../../services/api';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const COLUMNS = [
  { id: 'todo', title: 'TO DO', color: 'text-gray-400' },
  { id: 'in_progress', title: 'IN PROGRESS', color: 'text-blue-400' },
  { id: 'review', title: 'REVIEW', color: 'text-yellow-400' },
  { id: 'done', title: 'DONE', color: 'text-green-400' }
];

function TaskCard({ task, onClick, onMoveNext, isAdmin }) {
  const priorityColors = {
    low: { bg: 'bg-gray-600', text: 'text-gray-400', label: 'Low' },
    medium: { bg: 'bg-blue-600', text: 'text-blue-400', label: 'Medium' },
    high: { bg: 'bg-orange-600', text: 'text-orange-400', label: 'High' },
    urgent: { bg: 'bg-red-600', text: 'text-red-400', label: 'Urgent' }
  };

  const priority = priorityColors[task.priority] || priorityColors.medium;

  const nextStatusMap = {
    'todo': 'in_progress',
    'in_progress': 'review',
    'review': 'done'
  };

  const nextStatus = nextStatusMap[task.status];
  const isDone = task.status === 'done';

  const handleCardClick = () => {
    console.log('TaskCard clicked:', task._id, 'isDone:', isDone);
    if (!isDone) {
      onClick(task);
    }
  };

  const handleMoveClick = (e) => {
    e.stopPropagation();
    console.log('Move clicked:', task._id);
    onMoveNext(task);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`bg-surface-light p-3 mb-2 cursor-pointer hover:bg-surface transition-colors border border-surface-light rounded-lg ${isDone ? 'opacity-75' : ''}`}
    >
      <div className="flex items-start justify-between mb-2">
        <span className={`font-bold text-xs px-2 py-0.5 rounded ${priority.bg} text-white`}>
          {priority.label}
        </span>
      </div>
      <div>
        <span className="font-bold text-sm block mb-1">{task.title}</span>
        {task.description && (
          <p className="text-gray-400 text-xs line-clamp-2 mb-2">{task.description}</p>
        )}
      </div>
      <div className="flex items-center justify-between mt-2">
        {task.assignee && (
          <div className="w-6 h-6 bg-acid-yellow rounded-full flex items-center justify-center text-black text-xs font-bold">
            {task.assignee.username?.[0]?.toUpperCase() || '?'}
          </div>
        )}
        {task.dueDate && (
          <span className="text-gray-500 text-xs">
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
      {!isDone && nextStatus && (
        <button
          onClick={handleMoveClick}
          className="w-full mt-2 py-1 text-xs font-bold uppercase tracking-wider bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
        >
          Move to {nextStatus.replace('_', ' ')}
        </button>
      )}
    </div>
  );
}

function Column({ column, tasks, onTaskClick, onAddTask, onMoveNext, isAdmin }) {
  return (
    <div className="flex-1 min-w-[180px] md:min-w-[280px] bg-surface border border-surface-light rounded-lg flex flex-col overflow-hidden">
      <div className="p-3 md:p-4 border-b border-surface-light flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className={`font-bold uppercase tracking-wider text-sm md:text-base ${column.color}`}>
            {column.title}
          </h3>
          <span className="text-gray-500 text-sm">{tasks.length}</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} onClick={onTaskClick} onMoveNext={onMoveNext} isAdmin={isAdmin} />
        ))}
      </div>

      {isAdmin && column.id !== 'done' && (
        <div className="p-2 border-t border-surface-light flex-shrink-0">
          <button
            onClick={() => onAddTask(column.id)}
            className="w-full text-left p-2 text-gray-500 hover:text-acid-yellow hover:bg-surface-light transition-colors text-sm font-bold uppercase"
          >
            + Add Task
          </button>
        </div>
      )}
    </div>
  );
}

export function TaskBoard() {
  const { tasks, setTasks, addTask, updateTask, reorderTasks } = useTaskStore();
  const { currentWorkspace, isCurrentUserAdmin } = useWorkspaceStore();
  
  console.log('TaskBoard rendering, tasks:', tasks?.length, 'currentWorkspace:', currentWorkspace?._id);
  
  const [activeTask, setActiveTask] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'todo', priority: 'medium', dueDate: '' });
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminStatus = isCurrentUserAdmin();
    setIsAdmin(adminStatus);
  }, [currentWorkspace]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (currentWorkspace?._id) {
      loadTasks();
    }
  }, [currentWorkspace?._id]);

  const loadTasks = async () => {
    if (!currentWorkspace?._id) return;
    try {
      const response = await taskAPI.getAll(currentWorkspace._id);
      setTasks(response.data || []);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeTask = tasks.find(t => t._id === active.id);
    const overTask = tasks.find(t => t._id === over.id);

    if (activeTask && overTask && activeTask.status !== overTask.status) {
      try {
        await taskAPI.update(currentWorkspace._id, activeTask._id, { status: overTask.status });
        updateTask(activeTask._id, { status: overTask.status });
      } catch (err) {
        console.error('Failed to update task:', err);
      }
    }
  };

  const handleTaskClick = (task) => {
    console.log('Task clicked:', task, 'isAdmin:', isAdmin);
    setSelectedTask(task);
    setShowDetailModal(true);
  };

  const handleMoveNext = async (task) => {
    const nextStatusMap = {
      'todo': 'in_progress',
      'in_progress': 'review',
      'review': 'done'
    };
    const nextStatus = nextStatusMap[task.status];
    if (!nextStatus) return;
    
    updateTask(task._id, { status: nextStatus });
    
    try {
      await taskAPI.update(currentWorkspace._id, task._id, { status: nextStatus });
    } catch (err) {
      console.error('Failed to move task:', err);
      updateTask(task._id, { status: task.status });
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    
    const tempId = `temp-${Date.now()}`;
    const tempTask = {
      _id: tempId,
      ...newTask,
      createdAt: new Date().toISOString(),
      isOptimistic: true
    };
    
    addTask(tempTask);
    setShowCreateModal(false);
    const taskToCreate = { ...newTask };
    setNewTask({ title: '', description: '', status: 'todo', priority: 'medium', dueDate: '' });
    
    try {
      if (taskToCreate.dueDate) {
        taskToCreate.dueDate = new Date(taskToCreate.dueDate).toISOString();
      }
      const response = await taskAPI.create(currentWorkspace._id, taskToCreate);
      
      updateTask(tempId, response.data);
    } catch (err) {
      console.error('Failed to create task:', err);
      const currentTasks = useTaskStore.getState().tasks;
      setTasks(currentTasks.filter(t => t._id !== tempId));
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    updateTask(taskId, updates);
    setSelectedTask(prev => prev ? { ...prev, ...updates } : null);
    
    try {
      await taskAPI.update(currentWorkspace._id, taskId, updates);
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const previousTasks = [...tasks];
    setTasks(tasks.filter(t => t._id !== taskId));
    setShowDetailModal(false);
    
    try {
      await taskAPI.delete(currentWorkspace._id, taskId);
    } catch (err) {
      console.error('Failed to delete task:', err);
      setTasks(previousTasks);
    }
  };

  const getColumnTasks = (status) => {
    if (!tasks || !Array.isArray(tasks)) return [];
    return tasks
      .filter(t => t.status === status)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  if (!currentWorkspace) {
    return (
      <div className="flex-1 flex items-center justify-center bg-bg-black">
        <h2 className="text-h2 font-bold uppercase text-gray-500">Select a Workspace</h2>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-bg-black h-full overflow-hidden">
      <div className="p-3 md:p-4 border-b border-surface-light flex-shrink-0">
        <h2 className="text-lg md:text-h2 font-bold uppercase tracking-tight">Tasks</h2>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden p-2 md:p-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-2 md:gap-4 h-full pb-4">
            {COLUMNS.map((column) => (
              <Column
                key={column.id}
                column={column}
                tasks={getColumnTasks(column.id)}
                onTaskClick={handleTaskClick}
                onMoveNext={handleMoveNext}
                onAddTask={(status) => {
                  setNewTask({ ...newTask, status });
                  setShowCreateModal(true);
                }}
                isAdmin={isAdmin}
              />
            ))}
          </div>
          <DragOverlay>
            {activeTask && (
              <div className="bg-surface-light p-3 border border-acid-yellow">
                {activeTask.title}
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {showCreateModal && isAdmin && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-surface-light p-4 md:p-6 w-full max-w-md">
            <h3 className="text-lg md:text-h3 font-bold uppercase mb-4">Create Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <input
                type="text"
                placeholder="TASK TITLE"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="input-field"
                required
              />
              <textarea
                placeholder="DESCRIPTION"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="input-field h-20 resize-none"
              />
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                className="input-field"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="input-field"
              />
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">CREATE</button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 md:px-6 py-3 border border-surface-light hover:bg-surface-light uppercase font-bold tracking-wider text-sm"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetailModal && selectedTask && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-surface-light p-4 md:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg md:text-xl font-bold uppercase">Task Details</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Title</label>
                {isAdmin && selectedTask.status !== 'done' ? (
                  <input
                    type="text"
                    value={selectedTask.title}
                    onChange={(e) => handleUpdateTask(selectedTask._id, { title: e.target.value })}
                    className="input-field"
                  />
                ) : (
                  <p className="text-white font-medium">{selectedTask.title}</p>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Description</label>
                {isAdmin && selectedTask.status !== 'done' ? (
                  <textarea
                    value={selectedTask.description || ''}
                    onChange={(e) => handleUpdateTask(selectedTask._id, { description: e.target.value })}
                    className="input-field h-24 resize-none"
                  />
                ) : (
                  <p className="text-gray-300">{selectedTask.description || 'No description'}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Status</label>
                  {isAdmin && selectedTask.status !== 'done' ? (
                    <select
                      value={selectedTask.status}
                      onChange={(e) => handleUpdateTask(selectedTask._id, { status: e.target.value })}
                      className="input-field"
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="done">Done</option>
                    </select>
                  ) : (
                    <p className="text-white font-medium capitalize">{selectedTask.status.replace('_', ' ')}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Priority</label>
                  {isAdmin && selectedTask.status !== 'done' ? (
                    <select
                      value={selectedTask.priority || 'medium'}
                      onChange={(e) => handleUpdateTask(selectedTask._id, { priority: e.target.value })}
                      className="input-field"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  ) : (
                    <p className="text-white font-medium capitalize">{selectedTask.priority || 'Medium'}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Due Date</label>
                {isAdmin && selectedTask.status !== 'done' ? (
                  <input
                    type="date"
                    value={selectedTask.dueDate ? new Date(selectedTask.dueDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleUpdateTask(selectedTask._id, { dueDate: e.target.value ? new Date(e.target.value).toISOString() : null })}
                    className="input-field"
                  />
                ) : (
                  <p className="text-gray-300">
                    {selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : 'No due date'}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Created</label>
                <p className="text-gray-300">
                  {selectedTask.createdAt ? new Date(selectedTask.createdAt).toLocaleString() : 'N/A'}
                </p>
              </div>
              
              {(isAdmin || selectedTask.status !== 'done') && (
                <div className="pt-4 border-t border-surface-light flex gap-2">
                  {isAdmin && selectedTask.status !== 'done' && (
                    <button
                      onClick={() => handleDeleteTask(selectedTask._id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider text-sm"
                    >
                      Delete
                    </button>
                  )}
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-4 py-2 border border-surface-light hover:bg-surface-light font-bold uppercase tracking-wider text-sm flex-1"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
