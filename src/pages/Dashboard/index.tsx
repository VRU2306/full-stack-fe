
import { Button, Modal, TextField } from "@mui/material";
import { AxiosResponse } from "axios";
import TaskList from "components/DragandDrop/ListComponent";
import { format } from "date-fns";
import { useAuth } from "hooks/AuthProvider";
import { useEffect, useState } from "react";
import { ApiConstants } from "utils/api-constants";
import axiosHttp from "utils/axios-index";
import { SnackBarSeverityLevel } from "utils/enum";
import { Profile, SnackbarInterface, Tasks } from "utils/interface";

function Dashboard() {
    const userAuth = useAuth();
    const [profile, setProfile] = useState<Profile>(userAuth.user);
    const [tasks, setTasks] = useState<Tasks[]>([]);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [newTaskData, setNewTaskData] = useState<any>({});
    const toggleAddModal = () => setAddModalOpen(!addModalOpen);
    const [snackbar, setSnackbar] = useState<SnackbarInterface>({
        message: "",
        severity: SnackBarSeverityLevel.WARNING,
        vertical: "top",
        horizontal: "center",
        open: false
    });
    const handleAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewTaskData({ ...newTaskData, [name]: value });
    };
    useEffect(() => {
        let userData = userAuth.getUserInfo();
        if (userData) {
            setProfile(userData);
            axiosHttp.get(ApiConstants.tasks.get(userData?.id)).then((res: AxiosResponse) => {
                setTasks(res.data)
            }).catch((err: AxiosResponse) => {

            })
        }
        // eslint-disable-next-line
    }, []);

    const handleAddTask = async () => {
        const newTask = {
            ...newTaskData,
            userId: profile.id,
            name: profile.name,
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
    return <>
        <div className="px-4">
            Hello <span className="text-xl text-blue-900">{profile.name}</span>,<br />
            Here are your tasks


            <div className="px-3 mt-3 ">
                {tasks?.length > 0 ? (
                    <TaskList allTask={tasks as any} userData={profile} />
                ) : <Button onClick={toggleAddModal} className="!normal-case !bg-blue-600 !text-white px-4 w-96 !mb-4">Add Task</Button>}


            </div>
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
        </div>
    </>
}
export default Dashboard;
