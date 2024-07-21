import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Tasks } from 'utils/interface';
import TaskItem from './taskDraggable';

const TaskColumn = ({ tasks, columnId, onDelete, onUpdate }: { tasks: Tasks[], columnId: string, onDelete: (id: string) => void, onUpdate: (data: Tasks) => void; }) => (
    <Droppable droppableId={columnId}>
        {(provided) => (
            <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="p-4 bg-gray-100 rounded-lg w-full sm:w-1/3 h-[calc(100vh-4rem)]"
            >
                <p className='bg-blue-500 text-center text-white w-full capitalize'>{columnId}</p>
                <div className='h-full overflow-y-auto overflow-x-hidden'>
                    {tasks.map((task: Tasks, index: number) => (
                        <TaskItem task={task} key={task._id} index={index} onDelete={onDelete} onUpdate={onUpdate} />
                    ))}
                   
                </div>
            </div>
        )}
    </Droppable>
);
export default TaskColumn;