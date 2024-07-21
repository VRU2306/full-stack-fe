import { SnackBarSeverityLevel } from "./enum"

export interface Profile {
    googleSignedInUser: boolean,
    id: string,
    email: string,
    expiresIn: number,
    username: string,
    name: string,
    firstName: string,
    lastName: string
}

export interface Tasks {
    title: string,
    description: string,
    name: string,
    userId: string,
    taskDueDate: string,
    created: string,
    modified: string,
    column: 'Todo' | 'inProgress' | 'Done',
    _id: string

}
export interface TasksData {
    allTask: Tasks[]
}
export interface TaskItemProps {
    task: Tasks;
    index: number;
    onDelete: (id: string) => void;
    onUpdate: (task: Tasks) => void;
}

export interface TaskColumnProps {
    tasks: Tasks[];
    columnId: 'Todo' | 'inProgress' | 'Done';
    onDelete: (id: string) => void;
    onUpdate: (task: Tasks) => void;
}
export interface LoginData {
    email: string,
    password: string
}

export interface RegisterData {
    email: string,
    password: string,
    confirmPassword?: string,
    firstName: string,
    lastName: string
}
export interface ProfileData {
    email: string,
    name: string,
    googleSignIn: boolean
}

export interface SnackbarInterface {
    message: string,
    severity: SnackBarSeverityLevel,
    vertical: "top" | "bottom",
    horizontal: "center" | "left" | "right",
    open: boolean
}
