import { useMemo, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import TaskColumn from './task';
import { Alert, Button, Modal, Snackbar, TextField } from '@mui/material';
import { Profile, SnackbarInterface, Tasks, TasksData } from 'utils/interface';
import axiosHttp from 'utils/axios-index';
import { ApiConstants } from 'utils/api-constants';
import { AxiosResponse } from 'axios';
import { SnackBarSeverityLevel } from 'utils/enum';
import { format } from 'date-fns';
function TaskList({ allTask, userData }: { allTask: TasksData, userData: Profile }) {
    const [tasks, setTasks] = useState<Tasks[]>(allTask as any);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [newTaskData, setNewTaskData] = useState<any>({});
    const [sortBy, setSortBy] = useState('dateAsc');
    const [snackbar, setSnackbar] = useState<SnackbarInterface>({
        message: "",
        severity: SnackBarSeverityLevel.WARNING,
        vertical: "top",
        horizontal: "center",
        open: false
    });
    const toggleAddModal = () => setAddModalOpen(!addModalOpen);

    const handleAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setNewTaskData({ ...newTaskData, [name]: value });
    };

    const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbar({
            ...snackbar,
            open: false
        })
    };
    const onDragEnd = async (result: any) => {
        if (!result.destination) {
            return;
        }

        const { source, destination } = result;

        // Handle task movement within the same column
        if (source.droppableId === destination.droppableId) {
            const updatedTasks = Array.from(tasks);
            const [movedTask] = updatedTasks.splice(source.index, 1);
            updatedTasks.splice(destination.index, 0, movedTask);

            setTasks(updatedTasks);
        } else {
            // Handle task movement between columns
            const updatedTasks = Array.from(tasks);
            const [movedTask] = updatedTasks.splice(source.index, 1);

            // Adjust task's column property
            movedTask.column = destination.droppableId as 'Todo' | 'inProgress' | 'Done';
            updatedTasks.splice(destination.index, 0, movedTask);

            setTasks(updatedTasks);
            axiosHttp.patch(ApiConstants.tasks.updateById(movedTask._id), { column: result.destination.droppableId })
                .then((res: AxiosResponse) => {

                    setSnackbar({
                        ...snackbar,
                        open: true,
                        message: "Task Moved Successfully !",
                        severity: SnackBarSeverityLevel.SUCCESS,
                    });
                }).catch((err: AxiosResponse) => {
                    setSnackbar({
                        ...snackbar,
                        open: true,
                        message: "Cannot move the task please check!",
                        severity: SnackBarSeverityLevel.WARNING,
                    });
                })

        };
    };


    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const sortedAndFilteredTasks = useMemo(() => {
        const filteredTasks = tasks.filter(task =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return filteredTasks.sort((a: any, b: any) => {
            switch (sortBy) {
                case 'dateAsc':
                    // @ts-ignore
                    return new Date(a?.taskDueDate as any) - new Date(b.taskDueDate);
                case 'dateDesc':
                    // @ts-ignore
                    return new Date(b.taskDueDate) - new Date(a.taskDueDate);
                default:
                    return 0;
            }
        });
    }, [tasks, searchTerm, sortBy]);
    const handleAddTask = async () => {
        const newTask = {
            ...newTaskData,
            userId: userData.id,
            name: userData.name,
            column: "Todo"
        };
        axiosHttp.post(ApiConstants.tasks.add, newTask).then((res: AxiosResponse) => {
            toggleAddModal();
            setTasks(prevTasks => [...prevTasks, res.data]);
            setSnackbar({
                ...snackbar,
                open: true,
                message: "Task Added Successfully !",
                severity: SnackBarSeverityLevel.SUCCESS,
            });
        }).catch((err: AxiosResponse) => {

        })
    };

    const handleDeleteTask = async (id: string) => {
        axiosHttp.delete(ApiConstants.tasks.deleteById(id)).then((res: AxiosResponse) => {
        }).catch((err: AxiosResponse) => {

        })
        setTasks(tasks.filter(task => task._id !== id));

    };

    const handleUpdateTask = async (task: Tasks) => {
        if (task) {
            axiosHttp.patch(ApiConstants.tasks.updateById(task._id), task).then((res: AxiosResponse) => {
                setTasks(tasks.map((tasks: Tasks) => tasks._id === task._id ? res.data : tasks));

            }).catch((err: AxiosResponse) => {

            })
        }
    };
    const columns = {
        Todo: sortedAndFilteredTasks.filter(task => task.column === 'Todo'),
        inProgress: sortedAndFilteredTasks.filter(task => task.column === 'inProgress'),
        Done: sortedAndFilteredTasks.filter(task => task.column === 'Done'),
    };

    return (
        <>
            <div>
                <Button onClick={toggleAddModal} className="!normal-case !bg-blue-600 !text-white px-4 w-48 !mb-4">Add Task</Button>

                <div className=''>
                    <div className="mb-4 flex items-center justify-between">
                        <TextField
                            label="Search tasks..."
                            size='small'
                            fullWidth
                            variant="outlined"
                            value={searchTerm}
                            onChange={handleSearch}
                            className="mr-4  !w-full sm:!w-64"
                        />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="p-2 ml-2 border rounded !w-44 sm:!w-64"
                        >
                            <option value="dateAsc">Date Ascending</option>
                            <option value="dateDesc">Date Descending</option>
                        </select>
                    </div>
                    <hr className='mb-4' />
                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className="flex justify-between gap-3 overflow-x-auto overflow-y-hidden">
                            <TaskColumn columnId="Todo" tasks={columns.Todo} onDelete={handleDeleteTask} onUpdate={handleUpdateTask} />
                            <TaskColumn columnId="inProgress" tasks={columns.inProgress} onDelete={handleDeleteTask} onUpdate={handleUpdateTask} />
                            <TaskColumn columnId="Done" tasks={columns.Done} onDelete={handleDeleteTask} onUpdate={handleUpdateTask} />
                        </div>
                    </DragDropContext>
                </div>
                <Snackbar anchorOrigin={{ vertical: snackbar.vertical, horizontal: snackbar.horizontal }} open={snackbar.open} autoHideDuration={5000} onClose={handleCloseSnackbar}>
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={snackbar.severity}
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </div>


            {/* Add model */}
            <Modal open={addModalOpen} onClose={toggleAddModal}>
                <div className="p-4 bg-white rounded shadow-lg max-w-md mx-auto h-96 mt-10">
                    <h2 className="text-xl font-semibold">Add Task</h2>
                    <TextField
                        label="Title"
                        name="title"
                        onChange={handleAddChange}
                        fullWidth
                        required
                        className="!mt-4"
                        size='small'
                    />
                    <TextField
                        label="Description"
                        name="description"

                        onChange={handleAddChange}
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
                        onChange={handleAddChange}
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
                        <Button onClick={toggleAddModal} className="mr-2 text-blue-500">Cancel</Button>
                        <Button onClick={handleAddTask} className="text-blue-500">Save</Button>
                    </div>
                </div>
            </Modal>
        </>

    );
};

export default TaskList;
