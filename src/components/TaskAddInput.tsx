import React, { FC, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { ITask } from '../models/ITask';
import { v4 as uuidv4 } from 'uuid';

interface ITaskAddInput {
    setTask: (newTask: ITask) => void
}

export const TaskAddInput: FC<ITaskAddInput> = ({ setTask, ...props }) => {

    const [newTask, setNewTask] = useState<ITask>({ id: '', title: '', subTasks: [] } as ITask);

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
        setTask({ ...newTask, id: uuidv4() });
        setNewTask({
            id: '',
            title: '',
            subTasks: []
        });
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
        </Box>
    )
}
