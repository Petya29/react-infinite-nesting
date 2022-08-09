import React, { FC, useState } from 'react';
import { Alert, Box, Button, Slide, SlideProps, Snackbar, TextField } from '@mui/material';
import { ITask } from '../models/ITask';
import { v4 as uuidv4 } from 'uuid';

type TransitionProps = Omit<SlideProps, 'direction'>;
const TransitionRight = (props: TransitionProps) => {
    return <Slide {...props} direction="left" />;
}

interface ITaskAddInput {
    setTask: (newTask: ITask) => void
}

export const TaskAddInput: FC<ITaskAddInput> = ({ setTask, ...props }) => {

    const [newTask, setNewTask] = useState<ITask>({ id: '', title: '', subTasks: [] } as ITask);
    const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);

    const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTask({
            ...newTask,
            title: e.target.value
        });
    }

    const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') addNewTask();
    }

    const addNewTask = () => {
        if (newTask.title.trim() === '') {
            setIsSnackbarOpen(true);
            return;
        }

        setTask({ ...newTask, title: newTask.title.trim(), id: uuidv4() });
        setNewTask({
            id: '',
            title: '',
            subTasks: []
        });
    }

    const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setIsSnackbarOpen(false);
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <TextField
                fullWidth
                label={'+ Add task'}
                size='small'
                variant="outlined"
                sx={{ marginRight: '6px' }}
                InputProps={{
                    autoComplete: 'off'
                }}
                value={newTask.title}
                onChange={handleChangeTitle}
                onKeyPress={handleEnterPress}
            />
            <Button
                variant="contained"
                onClick={addNewTask}
            >
                {'Add'}
            </Button>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={isSnackbarOpen}
                autoHideDuration={2000}
                onClose={handleSnackbarClose}
                TransitionComponent={TransitionRight}
                sx={{ display: isSnackbarOpen ? 'flex' : 'none' }}
            >
                <Alert onClose={handleSnackbarClose} severity='error' sx={{ width: '100%' }}>
                    Task title cannot be empty!
                </Alert>
            </Snackbar>
        </Box>
    )
}
