
import { Draggable } from 'react-beautiful-dnd';
import { TaskItemProps } from 'utils/interface';
import { format } from 'date-fns';
import { Avatar, Button, Modal, TextField } from '@mui/material';
import { useState } from 'react';



function TaskItem({ task, index, onDelete, onUpdate }: TaskItemProps) {
    const [updatedTask, setUpdatedTask] = useState(task);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const toggleViewModal = () => setViewModalOpen(!viewModalOpen);
    const toggleEditModal = () => setEditModalOpen(!editModalOpen);

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUpdatedTask({ ...updatedTask, [name]: value });
    };


    const handleUpdate = () => {
        onUpdate(updatedTask);
        toggleEditModal();
    };

    const getInitials = (name: string) => {
        if (!name) return '';
        const nameArray = name.split(' ');
        return nameArray.map(word => word.charAt(0)).join('');
    };

    return (
        <>
            <Draggable draggableId={task._id} index={index}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="p-4 m-2 bg-blue-100 border border-gray-300 rounded-lg shadow-sm"
                        style={{ ...provided.draggableProps.style, ...provided.draggableProps.style }}
                    >
                        <div className="flex items-center justify-between">
                            <h4 className="text-lg font-semibold cursor-pointer" >
                                {task.title}
                            </h4>
                            <Avatar className="ml-2 uppercase !bg-gray-700">{getInitials(task.name)}</Avatar>
                        </div>
                        <p className="text-gray-600 w-64 mb-3">{task.description}</p>
                        <p className="text-sm text-gray-500">Added: {format(new Date(task.created), 'dd/MM/yyyy')}</p>
                        <p className="text-sm text-gray-500">Due: {format(new Date(task.taskDueDate), 'dd/MM/yyyy')}</p>
                        <div className='flex justify-end'>
                            <button onClick={() => onDelete(task._id)} className="mr-2 text-white bg-red-500 rounded-xl p-1">Delete</button>
                            <button onClick={toggleEditModal} className="me-2 text-white bg-blue-400  rounded-xl p-1">Edit</button>
                            <button onClick={toggleViewModal} className='me-3 text-white bg-blue-500 rounded-xl p-1'>View Details</button>

                        </div>
                    </div>
                )}
            </Draggable>

            <Modal open={viewModalOpen} onClose={toggleViewModal}>
                <div className="p-6 bg-white rounded-lg shadow-xl max-w-md h-auto mx-auto mt-20 relative">
                    <div className="flex justify-center items-center">
                        <h2 className="text-3xl font-bold">Task Details</h2>
                    </div>
                    <hr className="my-4" />
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xl font-semibold">Title:</h3>
                            <p className="text-gray-700">{task.title}</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold">Description:</h3>
                            <p className="text-gray-700">{task.description}</p>
                        </div>
                        <div>
                            <h3 className="text-sm text-gray-500">Added:</h3>
                            <p className="text-gray-700">{format(new Date(task.created), 'MM/dd/yyyy')}</p>
                        </div>
                        <div>
                            <h3 className="text-sm text-gray-500">Due:</h3>
                            <p className="text-gray-700">{format(new Date(task.taskDueDate), 'MM/dd/yyyy')}</p>
                        </div>
                        <div>
                            <h3 className="text-sm text-gray-500">Assigned To:</h3>
                            <p className="text-gray-700">{task.name}</p>
                        </div>
                    </div>
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={toggleViewModal}
                            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition">
                            Close
                        </button>
                    </div>
                </div>
            </Modal>


            <Modal open={editModalOpen} onClose={toggleEditModal}>
                <div className="p-4 bg-white rounded shadow-lg max-w-md mx-auto h-96 mt-10">
                    <h2 className="text-xl font-semibold">Edit Task</h2>
                    <TextField
                        label="Title"
                        name="title"
                        value={updatedTask.title}
                        onChange={handleEditChange}
                        fullWidth
                        required
                        className="!mt-4"
                        size='small'
                    />
                    <TextField
                        label="Description"
                        name="description"
                        value={updatedTask.description}
                        onChange={handleEditChange}
                        fullWidth
                        multiline={true}
                        required
                        rows={4}
                        className="!mt-4"
                        size='small'
                    />
                    <TextField
                        label="Due Date"
                        type="date"
                        name="taskDueDate"
                        value={format(new Date(updatedTask.taskDueDate), 'yyyy-MM-dd')}
                        onChange={handleEditChange}
                        fullWidth
                        required
                        className="!mt-4"
                        size='small'
                        inputProps={{ min: format(new Date(), 'yyyy-MM-dd') }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <div className="flex justify-end mt-4">
                        <Button onClick={toggleEditModal} className="mr-2 text-blue-500">Cancel</Button>
                        <Button onClick={handleUpdate} className="text-blue-500">Save</Button>
                    </div>
                </div>
            </Modal>
        </>

    );
};

export default TaskItem;
